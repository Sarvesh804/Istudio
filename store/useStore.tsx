import { create } from 'zustand'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (typeof window !== 'undefined') {
  if (!supabaseUrl) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not set')
  }
  if (!supabaseAnonKey) {
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
  }
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

interface Student {
  id: string
  name: string
  cohort: string
  courses: string[]
  date_joined: string
  last_login: string
  status: 'active' | 'inactive'
}

interface Filters {
  cohort: string
  status: string
  courses: string
  date_joined: string
}

interface State {
  students: Student[]
  filteredStudents: Student[]
  loading: boolean
  error: string | null
  filters: Filters
  fetchStudents: () => Promise<void>
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>
  setFilter: (key: keyof Filters, value: string) => void
  resetFilters: () => void
}

const defaultFilters: Filters = {
  cohort: '',
  status: '',
  courses: '',
  date_joined: '',
}

export const useStore = create<State>((set, get) => ({
  students: [],
  filteredStudents: [],
  loading: false,
  error: null,
  filters: defaultFilters,
  
  fetchStudents: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name', { ascending: true })
      if (error) throw error
      set({ 
        students: data || [], 
        filteredStudents: data || [],
        loading: false 
      })
    } catch (error) {
      console.error('Error fetching students:', error)
      set({ 
        error: 'Failed to fetch students. Please check your network connection and try again.',
        loading: false 
      })
    }
  },

  addStudent: async (student) => {
    try {
      const { data, error } = await supabase.from('students').insert([student]).select()
      if (error) throw error
      if (data) {
        const { students, filters } = get()
        const newStudents = [...students, data[0]]
        set({ students: newStudents })
        // Reapply filters after adding new student
        const filtered = applyFilters(newStudents, filters)
        set({ filteredStudents: filtered })
      }
    } catch (error) {
      console.error('Error adding student:', error)
      set({ error: 'Failed to add student. Please try again later.' })
    }
  },

  setFilter: (key: keyof Filters, value: string) => {
    const { students, filters } = get()
    console.log(filters)
    const newFilters = { ...filters, [key]: value }
    const filtered = applyFilters(students, newFilters)
    set({ filters: newFilters, filteredStudents: filtered })
  },

  resetFilters: () => {
    const { students } = get()
    set({ filters: defaultFilters, filteredStudents: students })
  },
}))

function applyFilters(students: Student[], filters: Filters): Student[] {
  return students.filter(student => {
    if (filters.cohort && student.cohort !== filters.cohort) return false
    if (filters.status && student.status !== filters.status) return false
    if (filters.courses && !student.courses.includes(filters.courses)) return false
    if (filters.date_joined) {
      const date = new Date(student.date_joined)
      const filterDate = new Date(filters.date_joined)
      if (date.toDateString() !== filterDate.toDateString()) return false
    }
    return true
  })
}

