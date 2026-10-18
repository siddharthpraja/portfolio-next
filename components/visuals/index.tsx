import type { ReactElement } from "react";
import { AccountbizVisual } from "./AccountbizVisual";
import { ModernizationVisual } from "./ModernizationVisual";
import { MobileVisual } from "./MobileVisual";
import { ClipVisual } from "./ClipVisual";
import { QresumeVisual } from "./QresumeVisual";

export const visuals: Record<string, () => ReactElement> = {
  accountbiz: AccountbizVisual,
  "crm-erp-modernization": ModernizationVisual,
  "react-native-apps": MobileVisual,
  "clip-css": ClipVisual,
  qresume: QresumeVisual,
};
