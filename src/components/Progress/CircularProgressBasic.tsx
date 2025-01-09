import { CircularProgress } from "@mui/material";
import { NormalCssProperties } from "@mui/material/styles/createMixins";
import { ReactNode } from "react";

const CircularProgressBasic = ({style, children} : {style : NormalCssProperties, children: ReactNode}) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <CircularProgress style={style} />
            <div className="mt-4">
                {children}
            </div>
        </div>
    );
}

export default CircularProgressBasic;