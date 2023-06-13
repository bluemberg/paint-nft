import React from 'react';

const THEMES = ["light", "dark", "cupcake", "cyberpunk"];

export default function Header() {
  const [theme, setTheme] = React.useState('light');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleThemeChange = (e: any) => {
    const val = e.target.getAttribute('data-set-theme');
    setTheme(val)
  }

  return (
    <header className='bg-base-100 py-2 sticky top-0 z-50'>
      <div className='container'>
        <div className="navbar px-0">
          <div className="navbar-start">
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-circle btn-primary lg:hidden mr-1">
                <i className='bi bi-list text-2xl'></i>
              </label>
            </div>
            <a className="btn btn-ghost normal-case text-2xl">PaintNFT</a>
          </div>
          <div className="navbar-center hidden lg:flex">
          </div>
          <div className="navbar-end">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn">
                {THEMES.length} Themes
              </label>
              <ul tabIndex={0} className="dropdown-content mt-1 w-52 max-h-96 overflow-y-auto menu menu-compact p-2  bg-base-200 shadow rounded-box">
                {
                  THEMES.map((theme, i) => <li key={theme + i}><button data-set-theme={theme} onClick={handleThemeChange} className="font-medium capitalize">{i + 1 + '. ' + theme}</button></li>)
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}