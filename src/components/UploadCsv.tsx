"use client";

import { useState } from "react";

export default function UploadLoans({ profileId }: { profileId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Pick a .csv file first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("profileId", profileId);

    try {
      const res = await fetch(`/api/upload-csv`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Успішно додано ${data.inserted} записів.`);
      } else {
        setMessage(`Помилка: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err?.message || JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Loading..." : "Upload .csv"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
