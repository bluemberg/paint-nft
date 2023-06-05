# Important Notes: 
# 1. Update the constants listed below with their appropriate values.
# 2. Deplying PaintMarketplace contract is dependent on the contract address of
#    a deployed PaintToken contract. So you must deploy PaintToken first
#    before deploying PaintMarketplace. Read the comment near the 
#    sp.add_compilation_target at the end of this file.
# 3. Before you can call the entry points of PaintMarketplace, you must call
#    set_administrator entry point of PaintToken and set the address of the
#    deployed PaintMarketplace as the admin. See how it's done in the test section.

import smartpy as sp

FA2 = sp.io.import_template("fa2_lib.py")

# Update these values
TOKEN_METADATA_PATH = 'https://www.example.com'
CONTRACT_METADATA_PATH = 'https://www.example.com'
ADMIN_ADDRESS = sp.address('tz1fcNTRug7RXfixJWttCcReTVXSLt2UozSU')

class PaintToken(FA2.Admin, FA2.MintNft, FA2.Fa2Nft):
    def __init__(self, admin, **kwargs):
        FA2.Fa2Nft.__init__(self, **kwargs)
        FA2.Admin.__init__(self, admin)

    @sp.entrypoint
    def burn(self, batch):
        """Users can burn tokens if they have the transfer policy permission.

        Burning an nft destroys its metadata.
        """
        sp.set_type(
            batch,
            sp.TList(
                sp.TRecord(
                    from_=sp.TAddress,
                    token_id=sp.TNat,
                    amount=sp.TNat,
                ).layout(("from_", ("token_id", "amount")))
            ),
        )
        sp.verify(self.policy.supports_transfer, "FA2_TX_DENIED")
        with sp.for_("action", batch) as action:
            sp.verify(self.is_defined(action.token_id), "FA2_TOKEN_UNDEFINED")
            self.policy.check_tx_transfer_permissions(
                self, action.from_, action.from_, action.token_id
            )
            with sp.if_(action.amount > 0):
                # Burn the token
                del self.data.ledger[action.token_id]
                del self.data.token_metadata[action.token_id]

class PaintMarketplace(sp.Contract):
    def __init__(self, token, metadata, admin):
        self.init(
            token=token,
            metadata=metadata,
            admin=admin,
            data=sp.big_map(
                tkey=sp.TNat,
                tvalue=sp.TRecord(
                    holder=sp.TAddress,
                    author=sp.TAddress,
                    amount=sp.TMutez,
                    token_id=sp.TNat,
                    collectable=sp.TBool
                )
            ),
            token_id=0,
        )

    @sp.entrypoint
    def mint_nft(self, params):
        '''Mint an NFT
        Parameters:
            - amount: sp.TMutez := selling price of this NFT
            - metadata: sp.TBytes := path to IPFS in binary representation
        Note:
            - When an NFT is minted, its author will also be its initial holder.
        '''
        sp.set_type(params, sp.TRecord(amount=sp.TMutez, metadata=sp.TBytes))
        
        sp.verify(params.amount > sp.mutez(0), 'Invalid token selling price')

        # Call deployed PaintToken's mint entrypoint to mint
        # a new NFT.
        mint_params = sp.TList(
            sp.TRecord(
                to_=sp.TAddress,
                metadata=sp.TMap(sp.TString, sp.TBytes)
            ).layout(('to_', 'metadata'))
        )
        token_contract = sp.contract(
            mint_params, 
            self.data.token, 
            entry_point='mint'
        ).open_some()
        args = [sp.record(
            to_=sp.self_address,
            metadata={ '': params.metadata})]
        sp.transfer(args, sp.mutez(0), token_contract)

        # Update data bigmap with the new NFT.
        self.data.data[self.data.token_id] = sp.record(
            holder=sp.sender,
            author=sp.sender,
            amount=params.amount,
            token_id=self.data.token_id,
            collectable=sp.bool(True)
        )

        # Increment token_id to prevent id duplication
        self.data.token_id += 1
        sp.verify(~self.data.data.contains(self.data.token_id), 'NonUniqueNewTokenID')

    @sp.entry_point
    def buy_nft(self, params):
        '''Buy an NFT
        Parameters:
            - token_id: sp.TNat := id of the token being bought
        Note:
            - In calling this entry point, the sender must include tezos
              that matches (but can exceed -- excess will be returned) the
              NFT's selling price. Once an NFT is bought, it cannot be sold
              anymore.
        '''
        sp.set_type(params, sp.TRecord(token_id=sp.TNat))

        sp.verify(self.data.data.contains(params.token_id), 'InvalidTokenID')
        sp.verify(sp.amount >= self.data.data[params.token_id].amount, 'InsufficientTezos')
        sp.verify(self.data.data[params.token_id].collectable, 'NotCollectable')
        sp.verify(self.data.data[params.token_id].author != sp.sender, "AuthorCannotCollect")

        # Call transfer entry point of the deployed PaintToken contract
        self.call_paint_token_transfer(
            self.data.token, 
            sp.self_address, 
            sp.sender, 
            params.token_id, 
            1)

        # NFT can only be collected once.
        self.data.data[params.token_id].collectable = False

        # Change NFT holder to the address of the buyer.
        self.data.data[params.token_id].holder = sp.sender

        # Pay NFT author the selling price of the NFT
        sp.send(self.data.data[params.token_id].author, self.data.data[params.token_id].amount)

        # Return extra tezos back to the NFT buyer.
        extra = sp.amount - self.data.data[params.token_id].amount
        sp.send(sp.sender, extra)

    @sp.entry_point
    def burn_nft(self, params):
        ''' Burn an NFT
        Parameters:
            - token_id: sp.TNat := id of the token to be burned
        Note:
            - An NFT can only be burned by its current holder or the marketplace admin.
        '''
        sp.set_type(params, sp.TRecord(token_id=sp.TNat))

        sp.verify(self.data.data.contains(params.token_id), 'InvalidTokenID')
        sp.if ~(sp.sender == self.data.data[params.token_id].holder) & ~(sp.sender == self.data.admin):
            sp.failwith('UnauthorizedToBurn')

        self.call_paint_token_burn(
            self.data.token, 
            sp.self_address, 
            params.token_id, 
            1)

        del self.data.data[params.token_id]
        sp.verify(~self.data.data.contains(params.token_id), 'BurnFailed')

    def call_paint_token_transfer(self, fa2, from_, to_, token_id, amount):
        token_contract = sp.contract(
            sp.TList(sp.TRecord(
                from_=sp.TAddress, 
                txs=sp.TList(sp.TRecord(
                    amount=sp.TNat, 
                    to_=sp.TAddress, 
                    token_id=sp.TNat
                ).layout(("to_", ("token_id", "amount"))))
            )), 
            fa2, 
            entry_point='transfer').open_some()
        sp.transfer(
            sp.list([
                sp.record(
                    from_=from_, 
                    txs=sp.list([sp.record(amount=amount, to_=to_, token_id=token_id)]))
            ]), 
            sp.mutez(0), 
            token_contract
        )

    def call_paint_token_burn(self, fa2, from_, token_id, amount):
        token_contract = sp.contract(
            sp.TList( 
                sp.TRecord(
                    from_=sp.TAddress,
                    token_id=sp.TNat,
                    amount=sp.TNat 
                ).layout(("from_", ("token_id", "amount")))
            ), 
            fa2, 
            entry_point='burn').open_some()
        sp.transfer(
            sp.list([
                sp.record(
                    from_=from_,
                    token_id=token_id,
                    amount=amount
                )
            ]), 
            sp.mutez(0), 
            token_contract
        )
        
@sp.add_test(name='PaintMarketplace')
def test():
    scenario = sp.test_scenario()
    admin = sp.test_account('admin')
    mark = sp.test_account('mark')
    elon = sp.test_account('elon')

    paint_tok_contract = PaintToken(
        admin=admin.address, 
        metadata=sp.utils.metadata_of_url('https://www.example.com'))
    scenario += paint_tok_contract

    paint_marketplace_contract = PaintMarketplace(
        token=paint_tok_contract.address,
        metadata=sp.utils.metadata_of_url("http://example.com"),
        admin=admin.address
    )
    scenario += paint_marketplace_contract

    paint_tok_contract.set_administrator(
        paint_marketplace_contract.address
    ).run(sender=admin)

    # ==========================================================
    # = Test mint_nft entry point
    # ==========================================================
    scenario.h1('Test mint_nft entry point')

    scenario.h2('Error: Invalid token selling price')
    paint_marketplace_contract.mint_nft(
        amount=sp.tez(0),
        metadata=sp.pack('https://www.example.com')
    ).run(sender=mark, valid=False)

    scenario.h2('Valid mint')
    paint_marketplace_contract.mint_nft(
        amount=sp.tez(100),
        metadata=sp.pack('https://www.example.com')
    ).run(sender=mark)

    scenario.h2('Valid mint')
    paint_marketplace_contract.mint_nft(
        amount=sp.tez(100),
        metadata=sp.pack('https://www.example.com')
    ).run(sender=mark)

    # ==========================================================
    # = Test buy_nft entry point
    # ==========================================================
    scenario.h1('Test buy_nft entry point')

    scenario.h2('Error: Insufficient Tezos')
    paint_marketplace_contract.buy_nft(
        token_id=sp.nat(0)
    ).run(sender=elon, amount=sp.tez(50), valid=False)
    
    scenario.h2('Error: Author cannot collect')
    paint_marketplace_contract.buy_nft(
        token_id=sp.nat(0)
    ).run(sender=mark, amount=sp.tez(300), valid=False)

    scenario.h2('Valid buy')
    paint_marketplace_contract.buy_nft(
        token_id=sp.nat(0)
    ).run(sender=elon, amount=sp.tez(300))

    scenario.h2('Error: NFT is not collectable')
    paint_marketplace_contract.buy_nft(
        token_id=sp.nat(0)
    ).run(sender=admin, amount=sp.tez(300), valid=False)

    # ==========================================================
    # = Test burn_nft entry point
    # ==========================================================
    scenario.h1('Test burn_nft entry point')

    scenario.h2('Error: Burner is not the token holder')
    paint_marketplace_contract.burn_nft(
        token_id=sp.nat(0),
    ).run(sender=mark, valid=False)
    
    scenario.h2('Valid burn since burner is token holder')
    paint_marketplace_contract.burn_nft(
        token_id=sp.nat(0)
    ).run(sender=elon)

    scenario.h2('Valid burn since burner is marketplace admin')
    paint_marketplace_contract.burn_nft(
        token_id=sp.nat(1)
    ).run(sender=admin)

    scenario.h2('Error: Invalid token id since the token has already been burned')
    paint_marketplace_contract.burn_nft(
        token_id=sp.nat(0)
    ).run(sender=elon, valid=False)

sp.add_compilation_target('token',
    PaintToken(admin=ADMIN_ADDRESS, metadata=sp.utils.metadata_of_url(TOKEN_METADATA_PATH)))

# Uncomment the succeeding sp.compilation_target and comment the previous 
# sp.add_compilation_target after deploying the PaintToken contract and
# retrieving the address of the deployed PaintToken contract.

# sp.add_compilation_target('marketplace',
#     PaintMarketplace(
#         token=sp.address('REPLACE_THIS'),
#         metadata=sp.utils.metadata_of_url(CONTRACT_METADATA_PATH),
#         admin=ADMIN_ADDRESS))
