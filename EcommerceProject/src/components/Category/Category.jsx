export const menuCategories = [
  {
    title: "Thiết kế",
    icon: "🎨",
    subcategories: [
      { name: "Đồ họa", path: "/products?category=do-hoa" },
      { name: "UI/UX", path: "/products?category=ui-ux" },
      { name: "3D Design", path: "/products?category=3d-design" },
      { name: "Motion Graphics", path: "/products?category=motion-graphics" },
    ],
  },
  {
    title: "Văn phòng",
    icon: "💼",
    subcategories: [
      { name: "Microsoft Office", path: "/products?category=microsoft-office" },
      { name: "Google Workspace", path: "/products?category=google-workspace" },
      { name: "PDF Tools", path: "/products?category=pdf-tools" },
      { name: "Email Clients", path: "/products?category=email-clients" },
    ],
  },
  {
    title: "Lập trình",
    icon: "💻",
    subcategories: [
      { name: "Web Development", path: "/products?category=web-dev" },
      { name: "Mobile Apps", path: "/products?category=mobile-apps" },
      { name: "Database Tools", path: "/products?category=database" },
      { name: "IDE & Editors", path: "/products?category=ide" },
    ],
  },
  {
    title: "Bảo mật",
    icon: "🔒",
    subcategories: [
      { name: "Antivirus", path: "/products?category=antivirus" },
      { name: "VPN", path: "/products?category=vpn" },
      { name: "Firewall", path: "/products?category=firewall" },
      {
        name: "Password Managers",
        path: "/products?category=password-managers",
      },
    ],
  },
];
