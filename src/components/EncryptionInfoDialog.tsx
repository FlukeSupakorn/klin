import { useState } from 'react'
import { Lock, Unlock, Info, AlertCircle } from 'lucide-react'
import { decryptPdf } from '@/lib/tauri-api'
import { useToast } from '@/components/ui/toast'

interface EncryptionInfoDialogProps {
  filePath: string
  fileName: string
  isOpen: boolean
  onClose: () => void
  onDecrypted?: () => void
}

export function EncryptionInfoDialog({
  filePath,
  fileName,
  isOpen,
  onClose,
  onDecrypted,
}: EncryptionInfoDialogProps) {
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const toast = useToast()

  const handleDecrypt = async () => {
    if (!password.trim()) {
      setError('Password is required')
      return
    }

    setIsDecrypting(true)
    setError(null)

    try {
      await decryptPdf(filePath, password)
      toast.success('File Decrypted', `${fileName} has been decrypted successfully`)
      setPassword('')
      onClose()
      onDecrypted?.()
    } catch (err: any) {
      setError(err.toString() || 'Failed to decrypt file')
    } finally {
      setIsDecrypting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-theme-background border border-theme rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Lock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-theme-text">File Encrypted</h2>
            <p className="text-xs text-theme-secondary">{fileName}</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
          <div className="flex gap-2">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                This file is encrypted with AES-256
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                This is real PDF encryption. The file requires a password in Adobe Reader, Preview, or any PDF viewer. Enter your password below to decrypt the file.
              </p>
            </div>
          </div>
        </div>

        {/* Encryption Details */}
        <div className="bg-theme-secondary/30 rounded-lg p-3 mb-4 space-y-2">
          <div className="text-xs">
            <span className="text-theme-secondary">Encryption:</span>
            <span className="text-theme-text ml-2">AES-256 (PDF Standard)</span>
          </div>
          <div className="text-xs text-theme-secondary">
            This PDF is password-protected. Enter your password to decrypt and remove the protection.
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 flex gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Password Input */}
        <div className="mb-4">
          <label className="text-sm font-medium text-theme-text mb-2 block">
            Enter Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isDecrypting) {
                  handleDecrypt()
                }
              }}
              placeholder="Enter decryption password"
              className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-text placeholder-theme-secondary text-sm"
              disabled={isDecrypting}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-secondary hover:text-theme-text transition-colors"
              type="button"
            >
              {showPassword ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0m7.303-1.152a.75.75 0 10-1.5 0 .75.75 0 001.5 0z"
                  />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-theme text-theme-text hover:bg-theme-secondary transition-colors text-sm font-medium"
            disabled={isDecrypting}
          >
            Close
          </button>
          <button
            onClick={handleDecrypt}
            disabled={isDecrypting || !password.trim()}
            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium flex items-center justify-center gap-2"
          >
            {isDecrypting ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Decrypting...
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4" />
                Decrypt
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
