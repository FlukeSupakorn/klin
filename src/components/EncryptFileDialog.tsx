import { useState } from 'react'
import { Lock, AlertCircle } from 'lucide-react'
import { encryptPdf } from '@/lib/tauri-api'
import { useToast } from '@/components/ui/toast'

interface EncryptFileDialogProps {
  filePath: string
  fileName: string
  isOpen: boolean
  onClose: () => void
  onEncrypted?: () => void
}

export function EncryptFileDialog({
  filePath,
  fileName,
  isOpen,
  onClose,
  onEncrypted,
}: EncryptFileDialogProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const toast = useToast()

  const validatePassword = () => {
    if (!password.trim()) {
      setError('Password is required')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleEncrypt = async () => {
    setError(null)

    if (!validatePassword()) {
      return
    }

    setIsEncrypting(true)

    try {
      await encryptPdf(filePath, password)
      toast.success('File Encrypted', `${fileName} has been encrypted. It now requires a password in any PDF reader.`)
      setPassword('')
      setConfirmPassword('')
      onClose()
      onEncrypted?.()
    } catch (err: any) {
      const errMsg = err.toString()
      if (errMsg.includes('QPDF_NOT_INSTALLED')) {
        setError('qpdf is required to encrypt PDFs.\n\nOne-time installation:\n\nWindows: winget install qpdf\nmacOS: brew install qpdf\nLinux: sudo apt install qpdf\n\nThen restart the app.')
      } else {
        setError(errMsg || 'Failed to encrypt file')
      }
    } finally {
      setIsEncrypting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-theme-background border border-theme rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-theme-text">Encrypt PDF</h2>
            <p className="text-xs text-theme-secondary">{fileName}</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
          <div className="flex gap-2">
            <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                Real PDF Password Protection
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                The PDF will require a password in Adobe Reader, Preview, or any PDF viewer.
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                💡 Uses qpdf (industry-standard encryption tool). <br/>
                Like how you need Adobe Reader to open encrypted PDFs - one-time setup.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 flex gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap">{error}</div>
          </div>
        )}

        {/* Password Inputs */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-sm font-medium text-theme-text mb-2 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                placeholder="Create a strong password"
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-text placeholder-theme-secondary text-sm"
                disabled={isEncrypting}
              />
            </div>
            <p className="text-xs text-theme-secondary mt-1">At least 6 characters recommended</p>
          </div>

          <div>
            <label className="text-sm font-medium text-theme-text mb-2 block">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setError(null)
                }}
                placeholder="Re-enter password"
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-text placeholder-theme-secondary text-sm"
                disabled={isEncrypting}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isEncrypting) {
                    handleEncrypt()
                  }
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="w-4 h-4 rounded border-theme"
            />
            <label htmlFor="showPassword" className="text-xs text-theme-secondary cursor-pointer">
              Show passwords
            </label>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
          <p className="text-xs text-amber-700 dark:text-amber-300">
            ⚠️ <strong>Important:</strong> Make sure you remember this password. There is no way to recover an encrypted file without it.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-theme text-theme-text hover:bg-theme-secondary transition-colors text-sm font-medium"
            disabled={isEncrypting}
          >
            Cancel
          </button>
          <button
            onClick={handleEncrypt}
            disabled={isEncrypting || !password.trim()}
            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium flex items-center justify-center gap-2"
          >
            {isEncrypting ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Encrypting...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Encrypt
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
