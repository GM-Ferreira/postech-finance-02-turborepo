import React from "react";

import LogoSvg from "@/assets/icons/svg/logo-icon.svg";

import { IconProps } from "./types";

export const LogoIcon: React.FC<IconProps> = ({
  width = 146,
  height = 32,
  ...props
}) => {
  return <LogoSvg width={width} height={height} {...props} />;
};
