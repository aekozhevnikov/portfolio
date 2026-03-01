import { describe, expect, it } from '@jest/globals'
import type { ProjectConfig } from 'src/config/projects.config'
import type { Project } from 'src/config/site.config'

describe('Projects Config', () => {
    it('should export ProjectConfig interface', () => {
        // Type-only check - ensure interface can be used
        const config: ProjectConfig = {
            id: '1',
            title: 'Test Project',
            description: 'Test description',
            technologies: {},
            order: 1,
            leftSided: false,
            private: false,
            showImage: true,
        }
        expect(config.title).toBe('Test Project')
    })

    it('should extend Project correctly', () => {
        const project: Project = {
            id: '1',
            title: 'Test',
            description: 'Test',
            technologies: {},
            order: 1,
        }
        expect(project).toBeDefined()
    })

    it('should allow optional properties', () => {
        const partialConfig: Partial<ProjectConfig> = {
            title: 'Partial Project',
        }
        expect(partialConfig.title).toBe('Partial Project')
        expect(partialConfig.id).toBeUndefined()
    })
})
