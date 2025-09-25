import React from "react";

import AvatarSvg from "@/assets/icons/svg/avatar-icon.svg";

import { IconProps } from "./types";

export const AvatarIcon: React.FC<IconProps> = ({ size = 40, ...props }) => {
  return <AvatarSvg width={size} height={size} {...props} />;
};
