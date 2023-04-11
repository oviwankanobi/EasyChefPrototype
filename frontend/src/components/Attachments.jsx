import { useState, useRef } from "react";
import { FileButton, Button, Group, Text, List } from "@mantine/core";

export default function Attachments(form) {
  const [files, setFiles] = useState([]);
  const resetRef = useRef(() => null);

  const handleFileUpload = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    const existingAttachments = form.getInputProps("galleryAttachments").value;
    const updatedAttachments = [
      ...existingAttachments,
      ...newFiles.map((file) => ({ files: file })),
    ];
    form.setFieldValue("galleryAttachments", updatedAttachments);
  };

  const clearFile = (props) => {
    setFiles([]);
    resetRef.current && resetRef.current();
    const count = form.getInputProps("galleryAttachments").value.length;
    for (let i = count - 1; i >= 0; i--) {
      form.removeListItem("galleryAttachments", i);
    }
  };

  return (
    <>
      <Group my="1rem" position="center">
        <FileButton
          resetRef={resetRef}
          onChange={handleFileUpload}
          accept="image/png,image/jpeg"
          multiple
        >
          {(props) => <Button {...props}>Upload image</Button>}
        </FileButton>
        <Button disabled={!files} color="red" onClick={clearFile}>
          Reset
        </Button>
      </Group>

      {files.length > 0 && (
        <Text size="sm" mt="sm">
          Picked files:
        </Text>
      )}

      <List size="sm" mt={5} withPadding>
        {files.map((file, index) => (
          <List.Item key={index}>{file.name}</List.Item>
        ))}
      </List>
    </>
  );
}
