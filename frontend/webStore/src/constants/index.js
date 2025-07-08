import { Package, Grid2x2Plus, Grid2X2, PackagePlus, DatabaseZap, Users, ScanEye } from "lucide-react";

export const navLinks = [
    {
        separator: true,
    },
    {
        text: "Home",
        href: "/home",
        icon: DatabaseZap,
    },
    {
        separator: true,
    },
    {
        text: "Products",
        href: "/products",
        icon: Package,
    },
    {
        text: "Add Product",
        href: "/products/new",
        icon: PackagePlus,
    },
    {
        separator: true,
    },
    {
        text: "Categories",
        href: "/categories",
        icon: Grid2X2,
    },
    {
        text: "Add Category",
        href: "/categories/new",
        icon: Grid2x2Plus,
    },
        {
        separator: true,
    },
        {
        text: "Logs",
        href: "/home",
        icon: ScanEye,
    },
    {
        text: "Users",
        href: "/home",
        icon: Users,
    },
];
