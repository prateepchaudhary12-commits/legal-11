import React, { useState } from 'react';
import { BookOpen, Calendar, CheckCircle2, ChevronRight, FileCheck, Layers } from 'lucide-react';
import { Course } from '../types';

interface CourseCurriculumProps {
  courses: Course[];
  onEnroll: (course: Course) => void;
  selectedCourseId?: string;
}

export const CourseCurriculum: React.FC<CourseCurriculumProps> = ({
  courses,
  onEnroll,
  selectedCourseId: initialSelectedId
}) => {
  const [activeCourseId, setActiveCourseId] = useState<string>(
    initialSelectedId || courses[1]?.id || courses[0]?.id
  );

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  return (
    <section id="curriculum" className="py-20 bg-[#140F24] border-b border-[#2E234B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#E5C067] font-semibold mb-3">
            <span>Comprehensive Syllabus</span>
            <span aria-hidden="true">·</span>
            <span>Day-by-Day Practical Modules</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#F7F2EA]">
            Detailed Course Modules & Draft Deliverables
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#BDB2D3]">
            Every module includes courtroom context, landmark Supreme Court precedents, and editable Word (.docx) drafting templates.
          </p>
        </div>

        {/* Course Selector Tabs */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2">
          <div className="inline-flex p-1.5 bg-[#1B1336] rounded-xl border border-[#3E2F63] gap-1">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => setActiveCourseId(course.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeCourseId === course.id
                    ? 'bg-[#E5C067] text-slate-950 shadow-md font-bold'
                    : 'text-[#C5BAD9] hover:text-white hover:bg-[#251A44]'
                }`}
              >
                {course.title.split(':')[0]} (₹{course.currentPrice})
              </button>
            ))}
          </div>
        </div>

        {/* Selected Course Curriculum Container */}
        {activeCourse && (
          <div className="bg-[#1A1333] border border-[#3E2F63] rounded-2xl p-6 sm:p-10 shadow-2xl">
            {/* Top Overview Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-[#2E234B] gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#FA527B]">
                  {activeCourse.category} · {activeCourse.duration}
                </span>
                <h3 className="text-2xl font-serif-title font-bold text-[#F7F2EA] mt-1">
                  {activeCourse.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A99EC0] mt-1 max-w-2xl">
                  {activeCourse.description}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-xs text-[#8E83A6] line-through block font-mono">
                    ₹{activeCourse.originalPrice}
                  </span>
                  <span className="text-2xl font-bold font-mono text-[#E5C067]">
                    ₹{activeCourse.currentPrice}
                  </span>
                </div>
                <button
                  onClick={() => onEnroll(activeCourse)}
                  className="py-3 px-6 bg-gradient-to-r from-[#FA527B] to-[#E13D66] text-white font-bold text-xs rounded-xl hover:opacity-95 transition-opacity shadow-lg shadow-[#FA527B]/20 whitespace-nowrap shrink-0"
                >
                  Enroll Now
                </button>
              </div>
            </div>

            {/* Modules Accordion / List */}
            <div className="mt-8 space-y-4">
              {activeCourse.syllabus.map((item, index) => (
                <div
                  key={index}
                  className="p-5 bg-[#140F26] border border-[#2E234B] hover:border-[#3E2F63] rounded-xl transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs font-mono font-bold text-[#E5C067] uppercase tracking-wider">
                        {item.dayOrSection}
                      </span>
                      <h4 className="text-base font-semibold text-[#F7F2EA]">
                        {item.topic}
                      </h4>
                    </div>
                    {item.keySkill && (
                      <span className="text-[11px] text-[#A69ABF] italic">
                        Focus: {item.keySkill}
                      </span>
                    )}
                  </div>

                  {/* Deliverables tags */}
                  <div className="mt-3 pt-3 border-t border-[#231A3D] flex flex-wrap gap-2 text-xs text-[#D8CFE6]">
                    <span className="text-[11px] text-[#FA527B] font-semibold uppercase tracking-wider self-center">
                      Ready Drafts Provided:
                    </span>
                    {item.draftDeliverables.map((draft, dIdx) => (
                      <span
                        key={dIdx}
                        className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-[#1F1738] rounded-md text-[11px] border border-[#342654] text-[#E5E0EC]"
                      >
                        <FileCheck className="w-3 h-3 text-[#E5C067]" />
                        <span>{draft}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Note */}
            <div className="mt-8 pt-6 border-t border-[#2E234B] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E93B5] gap-4">
              <span>
                💡 All drafting materials are provided in 100% editable Microsoft Word (.docx) format upon enrollment.
              </span>
              <button
                onClick={() => onEnroll(activeCourse)}
                className="text-[#E5C067] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Join Batch & Receive Class WhatsApp Group Invite</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
