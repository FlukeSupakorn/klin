import { useState, useRef, useEffect } from 'react'
import { Search, Sparkles, X, ArrowUp } from 'lucide-react'

interface AISearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  isSearching?: boolean
}

export function AISearchBar({ value, onChange, onSearch, isSearching }: AISearchBarProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px'
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) {
        onSearch()
      }
    }
  }

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      {/* Gradient fade effect */}
      <div className="h-8 bg-gradient-to-t from-theme-background to-transparent" />
      
      {/* Search bar container */}
      <div className="bg-theme-background pb-6 px-6 pointer-events-auto">
        <div className="max-w-3xl mx-auto">
          <div
            className={`
              relative flex items-end gap-3 
              bg-theme-secondary border-2 rounded-2xl
              transition-all duration-200 ease-out
              ${isFocused 
                ? 'border-theme-primary shadow-lg shadow-theme-primary/10' 
                : 'border-theme hover:border-theme-primary/50'
              }
            `}
          >
            {/* AI Sparkle Icon */}
            <div className="absolute left-4 bottom-4 flex items-center gap-2">
              <div className={`
                p-1.5 rounded-lg transition-colors
                ${isSearching 
                  ? 'bg-theme-primary/20 text-theme-primary animate-pulse' 
                  : 'bg-theme-primary/10 text-theme-primary'
                }
              `}>
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            {/* Input */}
            <textarea
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search your files with AI... Try 'find my recent PDFs' or 'documents about project'"
              rows={1}
              className={`
                flex-1 py-4 pl-14 pr-24
                bg-transparent text-theme-text placeholder-theme-muted
                resize-none outline-none
                text-base leading-relaxed
                scrollbar-thin scrollbar-thumb-theme-border scrollbar-track-transparent
              `}
              style={{ minHeight: '56px', maxHeight: '120px' }}
            />

            {/* Right side actions */}
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              {/* Clear button */}
              {value && (
                <button
                  onClick={handleClear}
                  className="p-2 text-theme-muted hover:text-theme-secondary transition-colors rounded-lg hover:bg-theme-tertiary"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Search/Send button */}
              <button
                onClick={() => value.trim() && onSearch()}
                disabled={!value.trim() || isSearching}
                className={`
                  p-2.5 rounded-xl transition-all duration-200
                  ${value.trim() 
                    ? 'bg-theme-primary text-white hover:bg-theme-primary-hover shadow-md hover:shadow-lg' 
                    : 'bg-theme-tertiary text-theme-muted cursor-not-allowed'
                  }
                  ${isSearching ? 'animate-pulse' : ''}
                `}
              >
                {isSearching ? (
                  <Search className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Helper text */}
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-theme-muted">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-theme-tertiary rounded text-[10px] font-medium">Enter</kbd>
              <span>to search</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-theme-tertiary rounded text-[10px] font-medium">Shift + Enter</kbd>
              <span>new line</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
