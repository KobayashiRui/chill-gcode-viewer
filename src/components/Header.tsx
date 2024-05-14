export default function Header(){
  return(
    <>
      <div className="navbar bg-base-100">
        <div className="items-start 1/4">
          <h1 className="text-sky-500 text-2xl m-3">Chill Gcode Viewer</h1>
        </div>
        <div className="navbar-center">
          <button>Load Gcode</button>
          <ul className="menu menu-horizontal px-1">
            <li><a>Item 1</a></li>
            <li>
              <details>
                <summary>Parent</summary>
                <ul className="p-2">
                  <li><a>Submenu 1</a></li>
                  <li><a>Submenu 2</a></li>
                </ul>
              </details>
            </li>
            <li><a>Item 3</a></li>
          </ul>
        </div>
        <div className="navbar-end">
          <a className="btn">Button</a>
        </div>
      </div>
    </>
  )
}