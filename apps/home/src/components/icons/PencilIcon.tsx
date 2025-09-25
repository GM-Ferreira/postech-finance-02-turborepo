import React from "react";

import PencilSvg from "@/assets/icons/svg/pencil-icon.svg";

import { IconProps } from "./types";

export const PencilIcon: React.FC<IconProps> = ({ size = 20, ...props }) => {
  return <PencilSvg width={size} height={size} {...props} />;
};
