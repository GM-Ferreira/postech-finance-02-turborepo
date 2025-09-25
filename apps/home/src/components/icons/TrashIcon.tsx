import React from "react";

import TrashSvg from "@/assets/icons/svg/trash-icon.svg";

import { IconProps } from "./types";

export const TrashIcon: React.FC<IconProps> = ({ size = 20, ...props }) => {
  return <TrashSvg width={size} height={size} {...props} />;
};
