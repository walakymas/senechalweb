from fpdf import FPDF
from config import Config
from database.markstable import MarksTable
from database.eventstable import EventsTable
import unicodedata

class Sheet(FPDF):
    def __init__(self, char):
        self.data = char.get_data()
        super().__init__()
        self.add_font('Sofia', '', 'pdf/GISMONDA.TTF', uni=True)
        self.add_page()
        self.year = int(MarksTable.year())
        self.set_font('Sofia', '', 22)
        self.cell(180, 10, self.data['name'], 0, 1, align='C')
        self.marks = []
        if char.memberid:
            mark_list = MarksTable().list(lord=char.memberid, year=self.year)
            for row in mark_list:
                self.marks.append(row[5])
        self.events = []
        if char.memberid:
            self.events = EventsTable().list(lord=char.memberid)
        self.fill()

    def parchment(self, text, width):
        y = self.get_y()
        x = self.get_x()
        self.set_xy(x, y+1)
        self.image('images/pdfpart.png', w=width, h=10)
        self.set_xy(x, y+2.5)
        self.set_font('Sofia', '', 10)
        self.cell(width, 5, text, 0, 2, align='C')
        self.set_xy(x, y+11)

    def stats(self):
        x = self.get_x()
        self.parchment('Stats', 30)

        self.set_font('Times', '', 8)
        if not Config.senechalConfig:
            Config.reload()
        for s in Config.senechalConfig['stats']:
            self.cell(20, 3, s)
            self.cell(5, 3, str(self.data['stats'][s.lower()[:3]]), 0, 2, align='R')
            self.set_x(x)

        self.cell(20, 1, "", 0, 2)
        self.cell(20, 3, "Damage")
        self.cell(5, 3, str(round((int(self.data['stats']['str']) + int(self.data['stats']['siz'])) / 6)) + 'd6', 0, 2, align='R')
        self.set_x(x)

        self.cell(20, 3, "Healing Rate")
        self.cell(5, 3, str(round((int(self.data['stats']['con']) + int(self.data['stats']['siz'])) / 10)), 0, 2, align='R')
        self.set_x(x)

        self.cell(20, 3, "Move Rate")
        self.cell(5, 3, str(round((int(self.data['stats']['dex']) + int(self.data['stats']['siz'])) / 10)), 0, 2, align='R')
        self.set_x(x)

        self.cell(20, 3, "HP")
        self.cell(5, 3, str(round((int(self.data['stats']['con']) + int(self.data['stats']['siz'])))), 0, 2, align='R')
        self.set_x(x)

        self.cell(20, 3, "Unconscious")
        self.cell(5, 3, str(round((int(self.data['stats']['con']) + int(self.data['stats']['siz'])) / 4)), 0, 2, align='R')
        self.set_x(x)

    def skills(self):
        for sn, sg in self.data['skills'].items():
            x = self.get_x()
            self.parchment(sn, 30)
            for name, value in sg.items():
                self.set_font('Times', '', 8)
                self.cell(20, 3, name)
                self.cell(5, 3, str(value), 0, 0, align='R')
                self.set_font('ZapfDingbats', '', 8)
                self.cell(3, 3, "on"[name in self.marks], 0, 2)
                self.set_x(x)

    def set_trait_font(self, name, virtues):
        s = ''
        if name in virtues:
            s += 'U'
        if name in Config.senechalConfig['chivalry']:
            s += 'B'
        self.set_font('Times', s, 8)

    def traits(self):
        x = self.get_x()
        traits = self.data['traits']
        virtues = []
        if 'Culture' in self.data['main']:
            if not Config.senechalConfig:
                Config.reload()
            for name, value in Config.senechalConfig['virtues'].items():
                if name in self.data['main']['Culture']:
                    virtues = value
        print(virtues)
        self.parchment('Traits', 50)
        for row in Config.senechalConfig['traits']:
            self.set_font('ZapfDingbats', '', 8)
            self.cell(3, 3, "on"[row[0] in self.marks], 0, 0)
            self.set_trait_font(row[0], virtues)
            self.cell(15, 3, row[0], 0, 0)
            self.set_font('Times', '', 8)
            self.cell(5, 3, str(traits[row[0].lower()[:3]]), align='R')
            self.cell(3, 3, "/", 0, 0, align='C')
            self.cell(5, 3, str(20-traits[row[0].lower()[:3]]), align='R')
            self.set_trait_font(row[1], virtues)
            self.cell(15, 3, row[1], 0, 0)
            self.set_font('ZapfDingbats', '', 8)
            self.cell(3, 3, "on"[row[1] in self.marks], 0, 2)
            self.set_x(x)
        chivalry = int(traits['ene'])+int(traits['gen'])+int(traits['jus'])\
                   +int(traits['mod'])+int(traits['mer'])+int(traits['val'])
        self.set_font('Times', '', 8)
        self.cell(50, 3, "Chivalry: " + str(chivalry) + "/80", 0, 2, align='C')

    def passions(self):
        x = self.get_x()
        self.parchment('Passions', 50)
        for name, value in self.data['passions'].items():
            self.set_font('Times', '', 8)
            self.cell(42, 3, name, 0, 0)
            self.cell(5, 3, str(value), 0, 0, align='R')
            self.set_font('ZapfDingbats', '', 8)
            self.cell(3, 3, "on"[name in self.marks], 0, 2)
            self.set_x(x)

    def param(self,  name, value):
        self.set_font('Times', 'B', 8)
        self.write(3, name+": ")
        self.set_font('Times', '', 8)
        self.write(3, str(value)+"\n")
        self.cell(42, 3, name, 0, 0)

    def event(self):
        x = self.get_x()
        self.parchment('Event', 80)
        self.set_font('Times', '', 8)
        for row in self.events:
            self.multi_cell(100, 5, f"Year: {row[3]}, Glory: {row[6]}, {unicodedata.normalize('NFKD',row[5]).encode('ascii', 'ignore')}", 0, 2)
            self.set_x(x)

    def main(self):
        self.parchment('Knight', 80)
        from database.eventstable import EventsTable
        if 'memberId' in self.data:
            self.data['main']['Glory'] = EventsTable().glory(self.data['memberId'])

        skipp = ['Homeland', 'Lord', 'Home', 'Culture', 'Glory', 'Born', 'Squired', 'Knighted']
        x = self.get_x()
        y = self.get_y()
        self.param("Homeland", self.data['main']['Homeland'])
        self.set_xy(x+40, y)
        self.param("Lord", self.data['main']['Lord'])
        y += 4
        self.set_xy(x, y)
        self.param("Home", self.data['main']['Home'])
        self.set_xy(x+40, y)
        self.param("Culture", self.data['main']['Culture'])

        y += 4
        self.set_xy(x, y)
        self.param("Age", str(self.year - int(self.data['main']['Born'])))
        self.set_xy(x+20, y)
        self.param("Born", self.data['main']['Born'])
        self.set_xy(x+40, y)
        self.param("Squired", self.data['main']['Squired'])
        self.set_xy(x+60, y)
        self.param("Knighted", self.data['main']['Knighted'])

        for name, value in self.data['main'].items():
            if name not in skipp:
                y += 4
                self.set_xy(x, y)
                self.param(name, value)
        y += 4
        self.set_xy(x, y)

    def fill(self):
        y = self.get_y()
        x = self.get_x()
        
        self.stats()
        self.skills()
        
        self.set_xy(x+40, y)
        self.traits()
        self.passions()
        
        self.set_xy(x+100, y)
        self.main()
        self.event()
