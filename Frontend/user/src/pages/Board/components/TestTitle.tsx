interface TestTitleProps {
  title: string
}

export function TestTitle({ title }: TestTitleProps) {
  // const toast = useToast()
  // const dispatch = useAppDispatch()
  // const exampleInfo = useAppSelector(selectExample)

  // dispatch(setExample('aaa'))

  // useEffect(() => {
  //   toast({ message: `Test toast and redux "${exampleInfo?.title}" in home`, status: 'success' })
  // }, [])
  return <div className=''>{title}</div>
}
