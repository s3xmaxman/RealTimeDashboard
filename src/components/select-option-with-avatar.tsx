import CustomAvatar from "./custom-avatar";
import { Text } from "./text";


type Props = {
    name: string
    avatarUrl?: string
    shape?: "square" | "circle"
}


const SelectOptionWithAvatar = ({ name, avatarUrl, shape = "square" }: Props) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
            }}
        >
            <CustomAvatar name={name} src={avatarUrl} shape={shape} />
            <Text>{name}</Text>
        </div>
    )
}

export default SelectOptionWithAvatar