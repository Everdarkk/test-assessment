'use client'

import { useState } from 'react'

export default function ProfileForm() {
  const [form, setForm] = useState({
    name: '',
    country: '',
    foundingYear: '',
    totalPortfolio: '',
    creditRiskScore: '',
    productType: '',
    websiteUrl: '',
    contacts: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // simple validation
    if (!form.name || !form.country) {
      setMessage('Name and Country are required')
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          country: form.country,
          foundingYear: form.foundingYear ? Number(form.foundingYear) : null,
          totalPortfolio: form.totalPortfolio
            ? Number(form.totalPortfolio)
            : null,
          creditRiskScore: form.creditRiskScore
            ? Number(form.creditRiskScore)
            : null,
          productType: form.productType || null,
          websiteUrl: form.websiteUrl || null,
          contacts: form.contacts || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Profile creation failed')
      }

      setMessage('Profile created successfully!')
      setForm({
        name: '',
        country: '',
        foundingYear: '',
        totalPortfolio: '',
        creditRiskScore: '',
        productType: '',
        websiteUrl: '',
        contacts: '',
      })
    } catch (err: unknown) {
        if (err instanceof Error) {
            setMessage(err.message)
        } else {
            setMessage('Unknown error occurred')
        }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
    >
      <h2>Create profile</h2>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name *"
        required
      />

      <input
        name="country"
        value={form.country}
        onChange={handleChange}
        placeholder="Country *"
        required
      />
      <input
        name="foundingYear"
        value={form.foundingYear}
        onChange={handleChange}
        placeholder="Founding Year"
        type="number"
      />
      <input
        name="totalPortfolio"
        value={form.totalPortfolio}
        onChange={handleChange}
        placeholder="Total Portfolio (EUR)"
        type="number"
        required
      />
      <input
        name="creditRiskScore"
        value={form.creditRiskScore}
        onChange={handleChange}
        placeholder="Credit Risk Score"
        type="number"
        required
      />
      <input
        name="productType"
        value={form.productType}
        onChange={handleChange}
        placeholder="Product Type (Mortgage/Private/Business)"
        required
      />
      <input
        name="websiteUrl"
        value={form.websiteUrl}
        onChange={handleChange}
        placeholder="Website URL"
        type="url"
      />
      <input
        name="contacts"
        value={form.contacts}
        onChange={handleChange}
        placeholder="Phone"
      />

      <button
        type="submit"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Profile'}
      </button>

      {message && <p>{message}</p>}
    </form>
  )
}
