import React, { useEffect, useState } from "react";
import IPreLoad from "../interfaces/IPreLoad";
import GeneratorHelper from "../helper/GeneratorHelper";
import Form, { BtnType, FieldType, FormSchema } from "../component/form/Form";
import { Rules } from "../component/form/rules";
import { Button } from "@mui/material";
const electron: IPreLoad = ((window as any).electron as IPreLoad) || {};
export default function BasicProjectSetup() {
  const [projectForm, setProjectForm] = useState({
    name: "",
  });
  useEffect(() => {
    readBasicConfigFile();
  }, []);

  const readBasicConfigFile = () => {
    const path = GeneratorHelper.getProjectPath() || "";
    electron.filesApi.readFile(path, "baseConfig.json").then((dataString) => {
      const data = JSON.parse(dataString);
      setProjectForm({
        name: data.name || '',
      });
    });
  };

  const handleButtonClick = (actionKey: string) => {
    if(actionKey=='submit') {
      const path = GeneratorHelper.getProjectPath() || '';
      GeneratorHelper.writeFile(path,'baseConfig.json',JSON.stringify(projectForm));
    }
  };


  return (
    <div style={{ height: "100vh" }}>
      <Form
        formSchema={basicSetupFormSchema}
        value={projectForm}
        onInput={(text) => setProjectForm(text)}
        onbuttonClick={(type) => handleButtonClick(type)}
      />
    </div>
  );
}

const basicSetupFormSchema: FormSchema = {
  fieldList: [
    {
      type: FieldType.TextField,
      dataSelectorKey: "name",
      label: "Project Name",
      rules: [Rules.Required]
    },
  ],
  actionList: [
    {
      label: "Sumbit",
      actionKey: "submit",
      validate: true
    },
  ],
};
