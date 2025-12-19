export const useOAuthUrl = () => {
  const oauthUrl = useState<string | null>('oauthUrl', () => null)

  const setOAuthUrl = (url: string) => {
    oauthUrl.value = url
  }

  const getOAuthUrl = () => {
    return oauthUrl.value
  }

  const clearOAuthUrl = () => {
    oauthUrl.value = null
  }

  return {
    oauthUrl: readonly(oauthUrl),
    setOAuthUrl,
    getOAuthUrl,
    clearOAuthUrl
  }
}
