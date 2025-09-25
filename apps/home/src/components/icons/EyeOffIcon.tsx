import React from "react";

import EyeOffSvg from "@/assets/icons/svg/eye-slash-icon.svg";

import { IconProps } from "./types";

export const EyeOffIcon: React.FC<IconProps> = ({ size = 20, ...props }) => {
  return <EyeOffSvg width={size} height={size} {...props} />;
};
