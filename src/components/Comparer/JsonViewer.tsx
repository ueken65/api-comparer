import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { KeyboardEvent, useRef, useState } from 'react'

type Props = {
  json: string
  setJson: (json: Record<string, unknown>) => void
}

const schema = z.object({ url: z.string().url() })

type SchemaType = z.infer<typeof schema>

const JsonViewer: React.FC<Props> = ({ json, setJson }) => {
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
      <div>
        <input
          className="border border-gray-300 rounded"
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
          do
        </button>
      </div>
      <div className="bg-gray-200 p-5">
        <code className="whitespace-pre-wrap">{loading ? '読み込み中...' : <>{json}</>}</code>
      </div>
    </div>
  )
}

export default JsonViewer
