import React from "react";

import { PlusSquareOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Text } from "@/components/text";

interface Props {
    onClick: () => void;
}

export const KanbanItemAddCardButton = ({
    onClick,
    children
}: React.PropsWithChildren<Props>) => {
    return (
        <Button
            icon={<PlusSquareOutlined className="md" />}
            size="large"
            onClick={onClick}
            style={{
                margin: "16px",
                backgroundColor: "white",
            }}
        >
            {children ?? (
                <Text type="secondary">新しいカードを追加</Text>
            )}
        </Button>
            
    )
} 