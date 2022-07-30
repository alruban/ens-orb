import React from 'react';
import { useTable, useSortBy } from 'react-table';

function Table({ columns, data }) {
 const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  },
  useSortBy
  )

  return (
    <table
      {...getTableProps()}
      className="sec-Query_Table"
      id="sec-Query_Table"
      >
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps([{ className: column.headerClassName }, column.getSortByToggleProps()])}>
                {column.render('Header')}
                <span className='sec-Query_TableSort'>
                  {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody
        {...getTableBodyProps()}
        className="sec-Query_TableBody"
        >
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps([
                  {
                    className: cell.column.dataClassName
                  },
                ])}
                >
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default Table