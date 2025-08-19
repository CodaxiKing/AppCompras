import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import { StatusIcon } from "../StatusIcon";

import { styles } from "./style";
import { FilterStatus } from "@/types/FilterStatus";


type Props = TouchableOpacityProps & {
    status: FilterStatus
    isActive: boolean
}

export function Filter({ status, isActive, ...rest }: Props) {
 return (
    <TouchableOpacity style={[styles.container, { opacity: isActive ? 1 : 0.5 }]} activeOpacity={0.8} {...rest} >

        <StatusIcon status={status} />
        <Text style={styles.title}>{status === FilterStatus.DONE ? "Comprados" : "Pendentes"}</Text>   
    </TouchableOpacity>
 )
}