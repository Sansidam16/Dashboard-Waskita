import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="text-xs text-gray-400 dark:text-gray-400 mb-6 px-6 mt-2 selection:bg-blue-200 selection:text-black" aria-label="Breadcrumb">
      <ol className="list-none flex flex-wrap gap-1">
        <li>
          <Link to="/" className="hover:underline text-blue-600">Home</Link>
        </li>
        {pathnames.map((name, idx) => {
          const routeTo = "/" + pathnames.slice(0, idx + 1).join("/");
          const isLast = idx === pathnames.length - 1;
          return (
            <li key={routeTo} className="flex items-center gap-1">
              <span>/</span>
              {isLast ? (
                <span className="font-semibold text-black">{decodeURIComponent(name.replace(/-/g, " "))}</span>
              ) : (
                <Link to={routeTo} className="hover:underline text-blue-600">{decodeURIComponent(name.replace(/-/g, " "))}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
