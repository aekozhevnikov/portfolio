/**
 * Utility functions for portfolio application
 */

/**
 * Generates a Devicon URL for technology icons
 * Devicon is a set of icons for programming languages and technologies
 * @param iconName - The icon name (e.g., 'vuejs', 'nodejs', 'typescript')
 * @param variant - Icon variant: 'original' (colored) or 'wordmark' (monochrome)
 * @returns The full URL to the Devicon SVG
 */
export const getDeviconUrl = (iconName: string, variant: string = 'original'): string => {
    const deviconName = iconName.toLowerCase().replace(/-/g, '')

    // Build filename based on variant
    const filename =
        variant === 'wordmark'
            ? `${deviconName}-original-${variant}.svg`
            : `${deviconName}-${variant}.svg`

    return `https://raw.githubusercontent.com/devicons/devicon/master/icons/${deviconName}/${filename}`
}
