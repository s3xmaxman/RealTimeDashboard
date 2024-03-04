import { DashboardOutlined, ProjectOutlined, ShopOutlined } from "@ant-design/icons";
import { IResourceItem } from "@refinedev/core";

export const resources: IResourceItem[] = [
    {
        name: "dashboard",
        list: "/",
        meta: {
            label: "ダッシュボード",
            icon: <DashboardOutlined />
        }
       
    },
    {
        name: "companies",
        list: "/companies",
        show: "/companies/:id",
        create: "/companies/new",
        edit: "/companies/edit/:id",
        meta: {
            label: "企業一覧",
            icon: <ShopOutlined />
        }
    },
    {
        name: "tasks",
        list: "/tasks",
        create: "/tasks/new",
        edit: "/tasks/edit/:id",
        meta: {
            label: "タスク一覧",
            icon: <ProjectOutlined />
        }
    }
]