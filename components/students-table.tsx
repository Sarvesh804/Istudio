'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useStore } from '@/store/useStore'
import { BookOpen, Calculator, AlertCircle, RefreshCw, Filter, Users, Calendar } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AddStudentDialog } from './add-student-dialog'

export function StudentsTable() {
  const { filteredStudents, loading, error, fetchStudents, setFilter, resetFilters } = useStore()
  const [date, setDate] = useState<Date>()

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      setFilter('date_joined', `${(selectedDate.getMonth() + 1).toString().padStart(2, '0') // Month (0-indexed, so +1)
        }/${selectedDate.getDate().toString().padStart(2, '0') // Day
        }/${selectedDate.getFullYear()}`)
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => fetchStudents()}
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </Alert>
    )
  }

  return (
    <div className="space-y-4 mt-0 bg-white p-5 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Select defaultValue="AY 2024-25">
            <SelectTrigger className="w-[140px] bg-gray-100 text-gray-600 font-bold">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent >
              <SelectItem value="AY 2024-25" onMouseDown={() => setFilter('cohort', 'AY 2024-25')}>AY 2024-25</SelectItem>
              <SelectItem value="AY 2023-24" onMouseDown={() => setFilter('cohort', 'AY 2023-24')}>AY 2023-24</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="CBSE 9">
            <SelectTrigger className="w-[110px] bg-gray-100 text-gray-600 font-bold">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CBSE 9" onMouseDown={() => setFilter('courses', 'CBSE 9 Science')}>CBSE 9</SelectItem>
              <SelectItem value="CBSE 10" onMouseDown={() => setFilter('courses', 'CBSE 10')}>CBSE 10</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] pl-3 text-left font-normal">
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
                <Calendar className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setFilter('status', 'active')}>
                Active Students
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter('status', 'inactive')}>
                Inactive Students
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => resetFilters()}>
                Reset Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <AddStudentDialog />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-black font-bold'>Student Name</TableHead>
            <TableHead className='text-black font-bold'>Cohort</TableHead>
            <TableHead className='text-black font-bold'>Courses</TableHead>
            <TableHead className='text-black font-bold'>Date Joined</TableHead>
            <TableHead className='text-black font-bold'>Last login</TableHead>
            <TableHead className='text-black font-bold'>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                <div className="flex items-center justify-center">
                  <div role="status" className="animate-spin">
                    <RefreshCw className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredStudents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="rounded-full bg-gray-100 p-3 mb-4">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No students found</p>
                  <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or add a new student</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.cohort}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {student.courses.map((course, index) => (
                      <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                        {course.includes('Science') ? (
                          <BookOpen className="h-4 w-4" />
                        ) : (
                          <Calculator className="h-4 w-4" />
                        )}
                        <span className="text-sm">{course}</span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{new Date(student.date_joined).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(student.last_login).toLocaleString()}</TableCell>
                <TableCell className='w-[80px] p-5'>
                  <div
                    className={`h-4 w-4 rounded-full  ${student.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

