import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { KeyboardEvent, useRef, useState } from 'react'
import ResultViewer from './ResultViewer'

type Props = {
  json: string
  setJson: (url: URL, json: Record<string, unknown>) => void
  resetJson: () => void
}

const schema = z.object({ url: z.string().url() })

type SchemaType = z.infer<typeof schema>

const JsonFetcher: React.FC<Props> = ({ json, setJson, resetJson }) => {
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const [fetchState, setFetchState] = useState<{ loading: boolean; error?: string }>({
    loading: false,
  })
  const {
    register,
    getValues,
    formState: { isValid },
  } = useForm<SchemaType>({ resolver: zodResolver(schema) })

  const onKeyUpInput = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submitButtonRef.current?.click()
    }
  }

  const onClickSubmitButton = async () => {
    setFetchState({ loading: true })

    const url = new URL(getValues('url'))

    try {
      const res = await axios.get(url.toString())

      setFetchState({ loading: false })
      setJson(url, res.data)
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setFetchState({ loading: false, error: error.message })
        resetJson()

        return
      }

      throw error
    }
  }

  return (
    <div>
      <div className="flex gap-2 items-center mb-2">
        <input
          className="border border-gray-300 rounded flex-grow px-2"
          placeholder="https://example.com/api/v2/home"
          onKeyUp={onKeyUpInput}
          {...register('url')}
        />
        <button
          type="submit"
          ref={submitButtonRef}
          disabled={!isValid || fetchState.loading}
          className="py-1 px-3 bg-blue-600 text-white rounded disabled:bg-slate-400 disabled:text-gray-200"
          onClick={onClickSubmitButton}
        >
          JSONを取得
        </button>
      </div>
      <ResultViewer text={fetchState.error ?? json} loading={fetchState.loading} />
    </div>
  )
}

export default JsonFetcher
