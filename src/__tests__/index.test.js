const { execSync } = require('child_process')

jest.mock('child_process', () => ({
  execSync: jest.fn(),
}))

const mockNPMList = Buffer.from(
  JSON.stringify({
    name: 'example-project',
    version: '1.0.0',
    dependencies: {
      '@some/thing': {
        version: '7.18.9',
        dependencies: {
          foo: {
            version: '0.98.7',
          },
        },
      },
      cookies: {
        version: '0.8.0',
        dependencies: {
          depd: {
            version: '2.0.0',
          },
          keygrip: {
            version: '1.1.0',
            dependencies: {
              tsscmp: {
                version: '1.0.6',
              },
            },
          },
        },
      },
      'another-pkg': {
        version: '3.3.2',
        dependencies: {},
      },
    },
  })
)

beforeEach(() => {
  execSync.mockReturnValue(mockNPMList)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('index.js', () => {
  it('returns the expected dependencies when there is no filtering', () => {
    const datwd = require('../index')
    expect(datwd()).toEqual([
      '@some/thing',
      'foo',
      'cookies',
      'depd',
      'keygrip',
      'tsscmp',
      'another-pkg',
    ])
  })

  it('returns a subset of dependencies when there is filtering', () => {
    const datwd = require('../index')
    expect(datwd(['cookies'])).toEqual(['cookies', 'depd', 'keygrip', 'tsscmp'])
  })

  it('returns one package when filtered on a dependency with no subdependencies', () => {
    const datwd = require('../index')
    expect(datwd(['another-pkg'])).toEqual(['another-pkg'])
  })

  it('returns an empty array when filtering on a *sub*dependency (filters are only for top-level dependencies)', () => {
    const datwd = require('../index')
    expect(datwd(['foo'])).toEqual([])
  })

  it('returns an empty array when filtering on an unused module', () => {
    const datwd = require('../index')
    expect(datwd(['this-does-not-exist'])).toEqual([])
  })

  it('works with a single package string rather than array', () => {
    const datwd = require('../index')
    expect(datwd('cookies')).toEqual(['cookies', 'depd', 'keygrip', 'tsscmp'])
  })

  it('does not include a package that is a substring of an inputted filter package', () => {
    const datwd = require('../index')
    expect(datwd('cookiesthing')).toEqual([]) // should not match "cookies"
  })
})
