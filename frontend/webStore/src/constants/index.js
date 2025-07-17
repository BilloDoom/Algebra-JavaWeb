import { Package, Grid2x2Plus, Grid2X2, PackagePlus, DatabaseZap, Users, ScanEye, BaggageClaim } from "lucide-react";

export const navLinks = [
    {
        separator: true,
        public: true,
    },
    {
        text: "Home",
        href: "/home",
        icon: DatabaseZap,
        public: true,
    },
    {
        separator: true,
        public: true,
    },
    {
        text: "Products",
        href: "/products",
        icon: Package,
        public: true,
    },
    {
        text: "Edit Products",
        href: "/products/new",
        icon: PackagePlus,
        public: false,
    },
    {
        separator: true,
        public: true,
    },
    // {
    //     text: "Categories",
    //     href: "/categories",
    //     icon: Grid2X2,
    //     public: true,
    // },
    {
        text: "Edit Categories",
        href: "/categories/new",
        icon: Grid2x2Plus,
        public: false,
    },
    {
        separator: true,
        public: false,
    },
    {
        text: "Logs",
        href: "/admin/logs",
        icon: ScanEye,
        public: false,
    },
    // {
    //     text: "Users",
    //     href: "/home",
    //     icon: Users,
    //     public: false,
    // },
    {
        separator: true,
        public: false,
    },
    {
        text: "Cart",
        href: "/cart",
        icon: BaggageClaim,
        public: true,
    },
    {
        separator: true,
        public: true,
    },
];
