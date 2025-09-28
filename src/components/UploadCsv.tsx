"use client";

import { useState } from "react";
import styles from '../styles/uploadcsv.module.css';
import Image from "next/image";

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
  const fileName = file ? file.name : "Choose a .csv file";

  // uploading the csv file to the server
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
        setMessage(`Successfully added ${data.inserted} records.`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err?.message || JSON.stringify(err)}`);
    } finally {
      setLoading(false);
      // refreshing the page to show the new loans
      window.location.reload();
    }
  };
  
  return (
    <div className={styles.container}>
      <label htmlFor="csv" className={styles.customFileInput}>
        {fileName}
      </label>
      <input id="csv" type="file" accept=".csv" onChange={handleFileChange} className={styles.hiddenInput}/>
      <button onClick={handleUpload} disabled={loading} className={styles.button}>
        {loading
          ? <span className={styles.loader}></span>
          : <Image
              src="/images/upload.png"
              alt="Upload"
              width={50}
              height={50}
              className={styles.uploadIcon}
            />
        }
      </button>
      {message && <p className={styles.message}>{message}</p>}
      <p className={styles.warning}><strong>Warning!</strong> Your .csv file must contain: status, amount, payment_schedule,interest_rate, ltv, risk_group, agreement_url, due_date columns or errors can occur.</p>
    </div>
  );
}
