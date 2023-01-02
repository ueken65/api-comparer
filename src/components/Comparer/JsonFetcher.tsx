import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { KeyboardEvent, useRef, useState } from 'react'
import JsonViewer from './JsonViewer'

type Props = {
  json: string
  setJson: (json: Record<string, unknown>) => void
}

const schema = z.object({ url: z.string().url() })

type SchemaType = z.infer<typeof schema>

const JsonFetcher: React.FC<Props> = ({ json, setJson }) => {
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const [loading, setLoading] = useState(false)
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
    setLoading(true)

    const url = new URL(getValues('url'))
    const res = await axios.get(url.toString())

    setLoading(false)

    setJson(res.data)
  }

  return (
    <div>
      <div className="flex gap-2 items-center mb-2">
        <input
          className="border border-gray-300 rounded flex-grow"
          placeholder="https://example.com/api/v2/home"
          onKeyUp={onKeyUpInput}
          {...register('url')}
        />
        <button
          type="submit"
          ref={submitButtonRef}
          disabled={!isValid}
          className="py-1 px-3 bg-blue-600 text-white rounded disabled:bg-slate-400 disabled:text-gray-200"
          onClick={onClickSubmitButton}
        >
          JSONを取得
        </button>
      </div>
      <JsonViewer json={json} loading={loading} />
    </div>
  )
}

export default JsonFetcher
