import React from "react";

import EyeSvg from "@/assets/icons/svg/eye-icon.svg";

import { IconProps } from "./types";

export const EyeIcon: React.FC<IconProps> = ({ size = 20, ...props }) => {
  return <EyeSvg width={size} height={size} {...props} />;
};
