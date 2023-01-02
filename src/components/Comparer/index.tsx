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
  const [json, setJson] = useState<{ A: FetchResponse | null; B: FetchResponse | null }>({
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
    assert(json.A !== null && json.B !== null)

    if (jsonDiff.diff(json.A.json, json.B.json, { keysOnly }) === undefined) {
      setComparedString('no diff.')
    } else {
      const diff = jsonDiff.diffString(json.A.json, json.B.json, {
        color: false,
        full: true,
        keysOnly,
      })

      const prefix = `--- ${json.A.url.toString()}\n+++ ${json.B.url.toString()} \n`
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
            json={json.A ? JSON.stringify(json.A.json, null, '  ') : '{}'}
            setJson={setJsonA}
            resetJson={resetJsonA}
          />
        </div>
        <div>
          <JsonFetcher
            json={json.B ? JSON.stringify(json.B.json, null, '  ') : '{}'}
            setJson={setJsonB}
            resetJson={resetJsonB}
          />
        </div>
        <div>
          <button
            className="py-1 mb-2 px-3 bg-blue-600 text-white rounded disabled:bg-slate-400 disabled:text-gray-200"
            onClick={handleOnClickCompareButton}
            disabled={json.A === null || json.B === null}
          >
            比較
          </button>
          <JsonViewer text={comparedString ?? ''} loading={false} />
        </div>
      </div>
    </div>
  )
}
