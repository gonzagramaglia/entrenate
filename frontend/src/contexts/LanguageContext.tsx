import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

type Language = 'es' | 'en'

type LanguageContextType = {
    language: Language
    setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function isEnglishPath(path: string): boolean {
    return path === '/en' || path.endsWith('/en') || path.endsWith('/en/') || path.includes('/en/')
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            return isEnglishPath(window.location.pathname) ? 'en' : 'es'
        }
        return 'es'
    })

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang)
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname
            const isEn = isEnglishPath(currentPath)
            const basePath = currentPath.startsWith('/entrenate') ? '/entrenate' : ''
            
            if (lang === 'en' && !isEn) {
                const target = `${basePath}/en`
                window.history.pushState(null, '', target + window.location.search + window.location.hash)
            } else if (lang === 'es' && isEn) {
                const target = basePath ? `${basePath}/` : '/'
                window.history.pushState(null, '', target + window.location.search + window.location.hash)
            }
        }
    }, [])

    useEffect(() => {
        const handlePopState = () => {
            const isEn = isEnglishPath(window.location.pathname)
            setLanguageState(isEn ? 'en' : 'es')
        }

        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
