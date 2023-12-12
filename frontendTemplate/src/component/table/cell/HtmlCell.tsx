import { CloseOutlined } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";

export const HtmlCell = ({value,dataSelectorKey}: {value: any;dataSelectorKey: string})=> {
    const [showHtmlContent, updateShowHtmlContent] = useState(false);
    const handleOpenHTML = () => {
        console.log(value,"Value")
        updateShowHtmlContent(true)
    }
    return (
        <div>
            <Dialog fullScreen onClose={() => updateShowHtmlContent(false)} open={showHtmlContent}>
                <DialogTitle className="d-flex "><span className="flex-fill">Content</span><CloseOutlined onClick={() => updateShowHtmlContent(false)} /></DialogTitle>
                
                <DialogContent>
                <div dangerouslySetInnerHTML={{ __html: value.contentHtml }} />
                </DialogContent>
            </Dialog>
            <Button onClick={handleOpenHTML}>Open Link</Button>
        </div>
    )
}