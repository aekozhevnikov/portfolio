import { type Project } from './site.config'

export interface ProjectConfig extends Project {
    leftSided?: boolean
    private?: boolean
    showImage?: boolean
    backgroundImage?: string
    skills?: string[]
    highlights?: string[]
    challenges?: string[]
    results?: string[]
    customStyle?: {
        background?: string
        border?: string
        btnColor?: string
        textColor?: string
    }
}
