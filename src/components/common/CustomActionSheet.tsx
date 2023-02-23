import { CupertinoPane, CupertinoSettings } from "cupertino-pane";
import { Dispatch, FC, ReactNode, SetStateAction, useEffect, useRef } from "react";

type CustomActionSheetProps = {
	isOpen: boolean,
	setOpen: Dispatch<SetStateAction<boolean>>,
    children?: ReactNode | ReactNode[],
    extraConfig?: CupertinoSettings,
    name: string
}

export const CustomActionSheet: FC<CustomActionSheetProps> = ({ name, isOpen, setOpen, children, extraConfig }) => {
	const paneRef = useRef<CupertinoPane>();

	useEffect(() => {
		if (!paneRef.current) {
			let settings: CupertinoSettings = {
				initialBreak: "top",
				backdrop: true,
				showDraggable: false,
				breaks: {
					top: { 
						enabled: true,
						height: 600
					},
					middle: { 
						enabled: false,
					},
					bottom: {
						enabled: false,
					}
				},
				events: {
					onDidDismiss: (e) => {
						setOpen(false);
					}
				},
                ...extraConfig
			}
			paneRef.current = new CupertinoPane(`#${name}-pane`, settings);
			paneRef.current.disableDrag();
		}
	}, [paneRef]);

	useEffect(() => {
		if (paneRef.current && isOpen) {
			paneRef.current.present({ animate: true });
		} else if (paneRef.current && !isOpen) {
			paneRef.current.hide();
		}
	}, [paneRef, isOpen]);

    return (
		<div id={`${name}-pane`}>
            {children}
		</div>
    );
}