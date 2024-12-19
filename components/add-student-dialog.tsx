'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useStore } from '@/store/useStore'
import { Checkbox } from '@/components/ui/checkbox'

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    cohort: z.string(),
    courses: z.array(z.string()).min(1, 'Select at least one course'),
})

export function AddStudentDialog() {
    const [open, setOpen] = useState(false)
    const { addStudent } = useStore()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            cohort: 'AY 2024-25',
            courses: [],
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await addStudent({
            name: values.name,
            cohort: values.cohort,
            courses: values.courses,
            date_joined: new Date().toISOString(),
            last_login: new Date().toISOString(),
            status: 'active',
        })
        setOpen(false)
        form.reset()
    }

    const courses = [
        { id: 'cbse-9-science', label: 'CBSE 9 Science' },
        { id: 'cbse-9-math', label: 'CBSE 9 Math' },
    ]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gray-100 text-gray-600 font-bold hover:bg-gray-50"><PlusIcon />Add new Student</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>
                        Add a new student to the system. Fill in all the required information.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Student name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cohort"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cohort</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select cohort" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="AY 2024-25">AY 2024-25</SelectItem>
                                            <SelectItem value="AY 2023-24">AY 2023-24</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="courses"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Courses</FormLabel>
                                    <div className="space-y-2">
                                        {courses.map((course) => (
                                            <FormField
                                                key={course.id}
                                                control={form.control}
                                                name="courses"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={course.id}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(course.label)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...field.value, course.label])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                    (value) => value !== course.label
                                                                                )
                                                                            )
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                {course.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button>Add Student</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

