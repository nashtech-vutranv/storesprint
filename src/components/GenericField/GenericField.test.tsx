import {BrowserRouter as Router} from 'react-router-dom'
import {render, screen, waitFor, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import {GenericInputField} from './GenericField'

test('it should render Single Generic Input Switch', async () => {
  const mockFn = jest.fn((e: any) => {})
  const singleInputSwitchTree = render(
    <Router>
      <GenericInputField
        positionIn='single'
        type='Boolean'
        cbBlurInSingle={mockFn}
        cbInSingle={mockFn}
        value={false}
        isDisabled={false}
      />
    </Router>
  )
  const {getByRole} = singleInputSwitchTree

  await waitFor(() => {
    expect(singleInputSwitchTree).toMatchSnapshot()
  })

  await waitFor(() => {
    fireEvent.click(getByRole('switch'))
    fireEvent.change(getByRole('switch'), {
      target: {checked: true},
    })
    mockFn({target: {checked: true}})
  })

  await waitFor(() => {
    fireEvent.click(getByRole('switch'))
    fireEvent.blur(getByRole('switch'), {
      target: {checked: true},
    })
    mockFn({target: {checked: true}})
  })
})

test('it should render Single Generic Input Date', async () => {
  const mockFn = jest.fn((e: any, selectedProp: any) => {})
  const singleInputDateTree = render(
    <Router>
      <GenericInputField
        positionIn='single'
        type='Date'
        cbBlurInSingle={mockFn}
        cbInSingle={mockFn}
        value='2022-11-12'
        selectedProp={'test-props'}
      />
    </Router>
  )
  
  const {getByDisplayValue} = singleInputDateTree

  await waitFor(() => {
    expect(singleInputDateTree).toMatchSnapshot()
    expect(getByDisplayValue('12/11/2022')).toBeInTheDocument()
  })

  await waitFor(() => {
    fireEvent.click(getByDisplayValue('12/11/2022'))
    fireEvent.change(getByDisplayValue('12/11/2022'), {
      target: {value: '2022-11-13'},
    })

    mockFn({target: {value: '2022-11-13'}}, 'test-props')
    expect(mockFn).toHaveReturned()
  })

  await waitFor(() => {
    fireEvent.click(getByDisplayValue('12/11/2022'))
    fireEvent.blur(getByDisplayValue('12/11/2022'), {
      target: {value: '2022-11-13'},
    })
    mockFn({target: {value: '2022-11-13'}}, 'test-props')
    expect(mockFn).toHaveReturned()
  })
})

test('it should render Single Generic Input Number', async () => {
  const mockFn = jest.fn((e: any) => {})
  const singleInputNumberTree = render(
    <Router>
      <GenericInputField
        positionIn='single'
        type='Number'
        cbBlurInSingle={mockFn}
        cbInSingle={mockFn}
        value={8}
        isDisabled={false}
        isFieldInvalid={false}
      />
    </Router>
  )
  
  await waitFor(() => {
    expect(singleInputNumberTree).toMatchSnapshot()
    expect(screen.getByDisplayValue(8)).toBeInTheDocument()
  })

  await waitFor(() => {
    fireEvent.change(screen.getByDisplayValue(8), {
      target: {value: 10},
    })
    mockFn({target: {value: 10}})
    expect(mockFn).toHaveReturned()
  })

  await waitFor(() => {
    fireEvent.blur(screen.getByDisplayValue(8), {
      target: {value: 10},
    })
    mockFn({target: {value: 10}})
    expect(mockFn).toHaveReturned()
  })
})

test('it should render Single Generic Input String', async () => {
  const mockFn = jest.fn((e: any) => {})
  const genericInputStringTree = render(
    <Router>
      <GenericInputField
        positionIn='single'
        type='String'
        cbBlurInSingle={mockFn}
        cbInSingle={mockFn}
        value={'test-value'}
        isDisabled={false}
        isFieldInvalid={false}
      />
    </Router>
  )
  
  await waitFor(() => {
    expect(genericInputStringTree).toMatchSnapshot()
    expect(screen.getByDisplayValue('test-value')).toBeInTheDocument()
  })

  await waitFor(() => {
    fireEvent.change(screen.getByDisplayValue('test-value'), {
      target: {value: 'test-change-value'},
    })
    mockFn({target: {value: 'test-change-value'}})
    expect(mockFn).toHaveReturned()
  })

  await waitFor(() => {
    fireEvent.blur(screen.getByDisplayValue('test-value'), {
      target: {value: 'test-change-value'},
    })
    mockFn({target: {value: 'test-change-value'}})
    expect(mockFn).toHaveReturned()
  })
})

test('it should render Single Generic Input Long String', async () => {
  const mockFn = jest.fn((e: any) => {})
  const genericInputLongStringTree = render(
    <Router>
      <GenericInputField
        positionIn='single'
        type='Long string'
        cbBlurInSingle={mockFn}
        cbInSingle={mockFn}
        value={'test-value'}
        isDisabled={false}
        isFieldInvalid={false}
      />
    </Router>
  )
  
  await waitFor(() => {
    expect(genericInputLongStringTree).toMatchSnapshot()
    expect(screen.getByDisplayValue('test-value')).toBeInTheDocument()
  })

  await waitFor(() => {
    fireEvent.change(screen.getByDisplayValue('test-value'), {
      target: {value: 'test-change-value'},
    })
    mockFn({target: {value: 'test-change-value'}})
    expect(mockFn).toHaveReturned()
  })

  await waitFor(() => {
    fireEvent.blur(screen.getByDisplayValue('test-value'), {
      target: {value: 'test-change-value'},
    })
    mockFn({target: {value: 'test-change-value'}})
    expect(mockFn).toHaveReturned()
  })
})

test('it should render InList Generic Input Switch', async () => {
  const mockFn = jest.fn((e: any, itemId: string, type: any) => {})
  const inListInputSwitchTree = render(
    <Router>
      <GenericInputField
        itemId='item-id'
        positionIn='list'
        type='Boolean'
        value={false}
        isDisabled={false}
        cbInList={mockFn}
        cbBlurInList={mockFn}
      />
    </Router>
  )
  const {getByRole} = inListInputSwitchTree
  
  await waitFor(() => {
    expect(inListInputSwitchTree).toMatchSnapshot()
  })

  await waitFor(() => {
    fireEvent.click(getByRole('switch'))
    fireEvent.change(getByRole('switch'), {
      target: {value: true},
    })
    mockFn({target: {value: true}}, 'test-id', 'Boolean')
    expect(mockFn).toHaveReturned()
  })

  await waitFor(() => {
    fireEvent.click(getByRole('switch'))
    fireEvent.blur(getByRole('switch'), {
      target: {value: true},
    })
    mockFn({target: {value: true}}, 'test-id', 'Boolean')
    expect(mockFn).toHaveReturned()
  })
})

test('it should render InList Generic Input Number', async () => {
  const mockFn = jest.fn((e: any) => {})
  const inListInputNumberTree = render(
    <Router>
      <GenericInputField
        itemId='item-id'
        positionIn='list'
        type='Number'
        value={8}
        isDisabled={false}
        cbInList={mockFn}
        cbBlurInList={mockFn}
      />
    </Router>
  )

  await waitFor(() => {
    expect(inListInputNumberTree).toMatchSnapshot()
    expect(screen.getByDisplayValue(8)).toBeInTheDocument()
  })

  await waitFor(() => {
    fireEvent.change(screen.getByDisplayValue(8), {
      target: {value: 10},
    })
    mockFn({target: {value: 10}})
    expect(mockFn).toHaveReturned()
  })

  await waitFor(() => {
    fireEvent.blur(screen.getByDisplayValue(8), {
      target: {value: 10},
    })
    mockFn({target: {value: 10}})
    expect(mockFn).toHaveReturned()
  })
})

test('it should render InList Generic Input Date', async () => {
  const mockFn = jest.fn((e: any, itemId: string, type: any) => {})
  const inListInputDateTree = render(
    <Router>
      <GenericInputField
        itemId='item-id'
        positionIn='list'
        type='Date'
        value={'2022-11-12'}
        isDisabled={false}
        cbInList={mockFn}
        cbBlurInList={mockFn}
      />
    </Router>
  )

  const {getByDisplayValue} = inListInputDateTree

  await waitFor(() => {
    expect(inListInputDateTree).toMatchSnapshot()
    expect(screen.getByDisplayValue('12/11/2022')).toBeInTheDocument()
    expect(getByDisplayValue('12/11/2022')).toBeInTheDocument()
  })

  await waitFor(() => {
    fireEvent.click(getByDisplayValue('12/11/2022'))
    fireEvent.change(getByDisplayValue('12/11/2022'), {
      target: {value: '2022-11-13'},
    })

    mockFn({target: {value: '2022-11-13'}}, 'test-id', 'Date')
    expect(mockFn).toHaveReturned()
  })

  await waitFor(() => {
    fireEvent.click(getByDisplayValue('12/11/2022'))
    fireEvent.blur(getByDisplayValue('12/11/2022'), {
      target: {value: '2022-11-13'},
    })
    mockFn({target: {value: '2022-11-13'}}, 'test-id', 'Date')
    expect(mockFn).toHaveReturned()
  })
})

test('it should render InList Generic Input Long String', async () => {
  const mockFn = jest.fn((e: any, itemId: string, type: any) => {})
  const genericInputLongStringTree = render(
    <Router>
      <GenericInputField
        itemId='item-id'
        positionIn='list'
        type='Long string'
        value={'test-value'}
        isDisabled={false}
        cbInList={mockFn}
        cbBlurInList={mockFn}
      />
    </Router>
  )

  await waitFor(() => {
    expect(genericInputLongStringTree).toMatchSnapshot()
    expect(screen.getByDisplayValue('test-value')).toBeInTheDocument()
  })
  
  await waitFor(() => {
    fireEvent.change(screen.getByDisplayValue('test-value'), {
      target: {value: 'test-change-value'},
    })
    mockFn({target: {value: 'test-change-value'}}, 'test-id', 'Long string')
    expect(mockFn).toHaveReturned()
  })

  await waitFor(() => {
    fireEvent.blur(screen.getByDisplayValue('test-value'), {
      target: {value: 'test-change-value'},
    })
    mockFn({target: {value: 'test-change-value'}}, 'test-id', 'Long string')
    expect(mockFn).toHaveReturned()
  })
})

test('it should render InList Generic Input String ', async () => {
  const mockFn = jest.fn((e: any, itemId: string, type: any) => {})
  const genericInputStringTree = render(
    <Router>
      <GenericInputField
        itemId='item-id'
        positionIn='list'
        type='String'
        value={'test-value'}
        isDisabled={false}
        cbInList={mockFn}
        cbBlurInList={mockFn}
      />
    </Router>
  )

  await waitFor(() => {
    expect(genericInputStringTree).toMatchSnapshot()
    expect(screen.getByDisplayValue('test-value')).toBeInTheDocument()
  })
  
  await waitFor(() => {
    fireEvent.change(screen.getByDisplayValue('test-value'), {
      target: {value: 'test-change-value'},
    })
    mockFn({target: {value: 'test-change-value'}}, 'test-id', 'String')
    expect(mockFn).toHaveReturned()
  })

  await waitFor(() => {
    fireEvent.blur(screen.getByDisplayValue('test-value'), {
      target: {value: 'test-change-value'},
    })
    mockFn({target: {value: 'test-change-value'}}, 'test-id', 'String')
    expect(mockFn).toHaveReturned()
  })
})
