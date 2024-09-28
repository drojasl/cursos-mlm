interface Route {
  title: string;
  link: string;
}

interface BreadcrumbsProps {
  routes: Route[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ routes }) => {
  return (
    <nav>
      {routes.map((route, index) => (
        <span key={index} className="opacity-50 ">
          <a href={route.link} className="font-bold">
            {route.title}
          </a>
          {index < routes.length - 1 && "/"}
        </span>
      ))}
    </nav>
  );
};
