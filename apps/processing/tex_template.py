# Copyright 2010 Sanjoy Mahajan
# License: GNU Affero GPL v3 or, at your option, any subsequent
# version published by the Free Software Foundation;
# <http://www.gnu.org/licenses/agpl.html> has the current version.

tex_header = r'''\enableregime[utf]

\definecolor[probframecolor][s=0.88]

\definetextbackground
    [pb]
    [           mp=background:random,
          location=paragraph,
     rulethickness=0.25pt,
        framecolor=probframecolor,
             width=local,
        leftoffset=1em,
       rightoffset=1em,
         topoffset=0em,
      bottomoffset=0em,
            before={\testpage[3]\blank[big]},
    ]

\startuseMPgraphic{background:random}
    path p;
    for i = 1 upto nofmultipars :
     p = (multipars[i]);
    fill p withgreyscale 0.88;
    draw p withcolor \MPvar{linecolor}
     withpen pencircle scaled \MPvar{linewidth};
    endfor;
\stopuseMPgraphic

\chardef\kindofpagetextareas\plusone

\newdimen\cropht  \cropht=%(crop_ht)gbp
\newdimen\cropwd  \cropwd=%(crop_wd)gbp
\definepapersize[canvas][height=\cropht, width=2\cropwd]
\setuppapersize[canvas][canvas]

\usetypescript[palatino][ec]
\definetypeface [palatino] [mm] [math] [euler] [euler] [rscale=1.03] 
\setupbodyfont[times,11pt]

\setuphead[title][style=\sca, header=high]

\setupcolors[state=start]
\setupinteraction[state=start]

\definelayer
  [substrate]
  [width=\paperwidth,
   height=\paperheight,
   preset=lefttop]

\setupwhitespace[medium]

\startsetups layer
\setlayer[substrate]{\externalfigure[%(srcfile)s][page=\whatpage, height=\paperheight, frame=off]}
\stopsetups

\defineoverlay [callouts] [\positionoverlay{callouts}]

\setupbackgrounds[page]
                 [setups=layer, background={substrate,callouts}]

\setuplayout[topspace=0.5in, header=0.5in, headerdistance=0in,
  backspace=0.5\paperwidth,
  width=0.45\paperwidth,
  rightmargin=0pt,
  height=middle]

%%\showframe

\startsetups[footline]
  {\it \getmarking[title]\hfill}
\stopsetups
\setupfootertexts[\setups{footline}][pagenumber]
\setuppagenumbering[location=]

\long\def\elink#1#2{\leavevmode
\begingroup\pdfstartlink
attr{/BS<</Type/Border/S/S/W 0>>}%%
user{/Subtype/Link/A<</Type/Action/S/URI/URI(\pdfescapestring{#1})>>}%%
\ignorespaces#2%%
\pdfendlink\endgroup
}

\newdimen\indentwidth \indentwidth=18pt
\long\def\comment#1#2#3#4#5{\ifnum#2=0\filbreak \vskip6pt\fi
{\leftskip=#2\indentwidth\relax
\vpos{#1}{\ifnum#4=1\startpb\fi
\elink{http://nb.csail.mit.edu/?comment=#5&org=pdf}{\ifnum#2=0 \bf \fi #3}%%
\ifnum#4=1\stoppb\fi}\vskip6pt}}

\definecolor [tred] [r=1,t=0.2,a=normal]
\definecolor [tgreen] [g=1,t=0.5,a=normal]

\startMPpositiongraphic{callout}
  pair st;
  path marker;
  initialize_box(\MPpos{\MPvar{to}});
  marker := llxy--lrxy--urxy--ulxy--cycle;
  st := 0.5[llxy, urxy];
  initialize_box(\MPpos{\MPvar{self}});
  fill fullcircle scaled 3bp shifted st withcolor \MPcolor{tgreen};
  fill marker withcolor \MPcolor{tred};
  draw st--0.5[llxy,ulxy]-(3pt,0) withcolor blue;
  anchor_box(\MPanchor{\MPvar{self}}) ;
\stopMPpositiongraphic

\def\whatpage{1}'''
