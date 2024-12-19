'use client'
import { Frame, HelpCircle, BarChart2, Settings, BookOpen, Users, Search, BellIcon, Settings2, MessageSquareIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePathname } from 'next/navigation'

export function Layout({ children }: { children: React.ReactNode }) {

    const pathname = usePathname()

    const sidebarItems = [
        { icon: BarChart2, label: 'Dashboard', href: '/dashboard' },
        { icon: Users, label: 'Students', href: '/' },
        { icon: BookOpen, label: 'Chapter', href: '/chapter' },
        { icon: HelpCircle, label: 'Help', href: '/help' },
        { icon: BarChart2, label: 'Reports', href: '/reports' },
        { icon: Settings, label: 'Settings', href: '/settings' },
    ]

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r">
                <div className="p-4">
                    <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
                        <Frame className="h-6 w-6" />
                        <span>Quyl.</span>
                    </Link>
                </div>
                <nav className="mt-8 px-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                                        ? 'bg-gray-200 text-black font-semibold'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16  bg-gray-50 flex items-center justify-between px-4">
                    <div className="flex-1 max-w-xl relative">

                        <Input type="search" placeholder="Search your course" className="w-full bg-white py-5 pl-10 rounded-xl " />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 material-icons">
                            <Search className='h-4 w-4' />
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon">
                            <HelpCircle className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="relative">
                            <div className="absolute top-2 right-2 h-2 w-2 bg-red-500 z-10 rounded-full text-[10px] text-white flex items-center justify-center" />
                            <MessageSquareIcon className="h-8 w-8 relative" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Settings2 className="h-8 w-8" />
                        </Button>
                        <Button variant="ghost" size="icon" className='relative'>
                            <div className="absolute top-2 right-2 h-2 w-2 bg-red-500 z-10 rounded-full text-[10px] text-white flex items-center justify-center" />

                            <BellIcon className="h-8 w-8" />
                        </Button>
                        <Avatar>
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">Adeline H. Dancy</p>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 bg-gray-50">{children}</main>
            </div>
        </div >
    )
}

