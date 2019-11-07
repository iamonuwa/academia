import React, { useRef, useState, useContext } from "react";
import styled from "styled-components";
import { UploadCloud } from "react-feather";
import { useToasts } from "react-toast-notifications";
import {
  Button,
  FormGroup,
  Label,
  Input,
  Message,
  Textarea,
  Select
} from "../../theme";
import AppContext from "../../contexts/Arweave.context";
import {
  getStoredValue,
  getFileExtension,
  getContentType,
  validateFile
} from "../../utils";
import { APP_NAME, APP_VERSION } from "../../constants";
const StyledForm = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;
  flex-direction: column;
  border: 1px dotted ${({ theme }) => theme.backgroundColor};
  padding: 3rem;
`;

const StyledFile = styled(Button)`
  border-radius: 0;
  text-align: center;
  width: 15rem;
`;

const StyledFormGroup = styled.div`
  align-self: center;
  margin: 2rem 0;
`;

export default function() {
  const { arweave } = useContext(AppContext);
  const wallet = getStoredValue("wallet");
  const fileRef = useRef(null);
  const { addToast } = useToasts();

  const [state, setState] = useState({
    file: null,
    docType: null,
    fileName: "",
    abstract: "",
    license: "open_access"
  });

  function triggerInput() {
    fileRef.current.click();
  }

  async function handleInputFileChange(event) {
    const fileReader = new FileReader();
    let { files } = event.target;

    if (files.length > 0) {
      let docType = getFileExtension(files[0].name);
      if (validateFile(docType)) {
        fileReader.onload = async e => {
          try {
            setState({
              file: e.target.result,
              docType,
              fileName: files[0].name,
              abstract: state.abstract
            });
          } catch (err) {
            console.log("Error: ", err);
            addToast("Failed to upload file", {
              appearance: "error"
            });
          }
        };
        fileReader.readAsDataURL(files[0]);
      } else {
        addToast("Invalid file format. Use PDF or docx files only", {
          appearance: "error"
        });
        console.log("Invalid file format. Use PDF or docx files only");
      }
    }
  }

  async function submit() {
    let { fileName, abstract, license, docType } = state;
    let key = JSON.parse(wallet);
    const tx = await arweave.createTransaction(
      {
        data: Buffer.from(state.file, "utf8")
      },
      key
    );

    const { data } = await arweave.api.get("/tx_anchor");
    tx.last_tx = data;

    tx.addTag("App-Name", APP_NAME);
    tx.addTag("Content-Type", getContentType(docType));
    tx.addTag("App-Version", APP_VERSION);
    tx.addTag("title", fileName);
    tx.addTag("license", license);
    tx.addTag("owner", getStoredValue("address"));
    tx.addTag("abstract", abstract);
    tx.addTag("createdAt", new Date().getTime());
    tx.addTag("Type", "publish");

    await arweave.transactions.sign(tx, key);

    let { status } = await arweave.transactions.post(tx);

    if (status === 200) {
      // trigger success alert
      console.log("Saved successfully");
      addToast("Your publication has been uploaded and saved successfully", {
        appearance: "success"
      });
    } else if (status === 400) {
      // trigger failed to save document
      console.log("Failed to save document");
      addToast("Failed to save document. An error occured", {
        appearance: "error"
      });
    } else {
      // trigger internal server error
      addToast("Internal server error", {
        appearance: "error"
      });
      console.log("Internal server error.");
    }
  }

  return (
    <>
      <StyledForm>
        <StyledFormGroup>
          <StyledFile onClick={triggerInput}>
            <UploadCloud size={14} />
            &nbsp; Select Document
          </StyledFile>
          <input
            type="file"
            ref={fileRef}
            onChange={handleInputFileChange}
            style={{ display: "none" }}
          />
        </StyledFormGroup>
        {state.file && (
          <>
            <FormGroup>
              <>
                <Label htmlFor="title">Title</Label>
                <Input
                  value={state.fileName}
                  onChange={e =>
                    setState({
                      fileName: e.target.value,
                      abstract: state.abstract,
                      file: state.file,
                      docType: state.docType,
                      license: state.license
                    })
                  }
                  id="title"
                  name="title"
                />
                <Message></Message>
              </>
              <>
                <Label htmlFor="abstract">Abstract</Label>
                <Textarea
                  value={state.abstract}
                  maxLength={300}
                  onChange={e =>
                    setState({
                      abstract: e.target.value,
                      file: state.file,
                      fileName: state.fileName,
                      docType: state.docType,
                      license: state.license
                    })
                  }
                  id="abstract"
                  name="abstract"
                />
                {state.abstract && (
                  <Message>
                    {state.abstract.length > 0
                      ? `${state.abstract.length} words`
                      : ""}
                  </Message>
                )}
                <Label>Choose License</Label>
                <Select
                  defaultValue="open_access"
                  onChange={e =>
                    setState({
                      fileName: state.fileName,
                      abstract: state.abstract,
                      file: state.file,
                      docType: state.docType,
                      license: e.target.value
                    })
                  }
                  value={state.license}
                >
                  <option value="creative_commons_license">
                    Creative Commons License
                  </option>
                  <option value="open_access">Open Access License</option>
                  <option value="original_work">CC BY-NC 4.0 License</option>
                </Select>
              </>
            </FormGroup>
            <StyledFormGroup>
              <Button disabled={!state.file} onClick={submit}>
                submit
              </Button>
            </StyledFormGroup>
          </>
        )}
      </StyledForm>
    </>
  );
}
