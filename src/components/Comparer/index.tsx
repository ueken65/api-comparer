import assert from 'assert'
import * as jsonDiff from 'json-diff'
import { useState } from 'react'
import JsonFetcher from './JsonFetcher'
import JsonViewer from './ResultViewer'

type FetchResponse = {
  url: URL
  json: Record<string, unknown>
}

export const Comparer = () => {
  const [fetchResponses, setJson] = useState<{ A: FetchResponse | null; B: FetchResponse | null }>({
    A: null,
    B: null,
  })
  const [comparedString, setComparedString] = useState<string>()
  const [keysOnly, setKeysOnly] = useState(false)

  const setJsonA = (url: URL, json: Record<string, unknown>) =>
    setJson((prev) => {
      return { ...prev, A: { url, json } }
    })

  const resetJsonA = () =>
    setJson((prev) => {
      return { ...prev, A: null }
    })

  const setJsonB = (url: URL, json: Record<string, unknown>) =>
    setJson((prev) => {
      return { ...prev, B: { url, json } }
    })

  const resetJsonB = () =>
    setJson((prev) => {
      return { ...prev, B: null }
    })

  const handleOnClickCompareButton = () => {
    assert(fetchResponses.A !== null && fetchResponses.B !== null)

    if (jsonDiff.diff(fetchResponses.A.json, fetchResponses.B.json, { keysOnly }) === undefined) {
      setComparedString('no diff.')
    } else {
      const diff = jsonDiff.diffString(fetchResponses.A.json, fetchResponses.B.json, {
        color: false,
        full: true,
        keysOnly,
      })

      const prefix = `--- ${fetchResponses.A.url.toString()}\n+++ ${fetchResponses.B.url.toString()} \n`
      setComparedString(prefix + diff)
    }
  }

  return (
    <div className="p-5">
      <div className="border border-gray-300 rounded p-5 mb-5">
        <h2 className="font-bold mb-2">オプション</h2>
        <div className="flex gap-2">
          <input id="keysOnlyCheck" type="checkbox" onChange={(e) => setKeysOnly(e.target.checked)} />
          <label htmlFor="keysOnlyCheck">keyのみを比較する</label>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div>
          <JsonFetcher
            json={fetchResponses.A ? JSON.stringify(fetchResponses.A.json, null, '  ') : '{}'}
            setJson={setJsonA}
            resetJson={resetJsonA}
          />
        </div>
        <div>
          <JsonFetcher
            json={fetchResponses.B ? JSON.stringify(fetchResponses.B.json, null, '  ') : '{}'}
            setJson={setJsonB}
            resetJson={resetJsonB}
          />
        </div>
        <div>
          <button
            className="py-1 mb-2 px-3 bg-blue-600 text-white rounded disabled:bg-slate-400 disabled:text-gray-200"
            onClick={handleOnClickCompareButton}
            disabled={fetchResponses.A === null || fetchResponses.B === null}
          >
            比較
          </button>
          <JsonViewer text={comparedString ?? ''} loading={false} />
        </div>
      </div>
    </div>
  )
}
