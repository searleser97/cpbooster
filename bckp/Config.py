'''
cpbooster "Competitive Programming Booster"
Copyright (C) 2020  Sergio G. Sanchez V.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
'''

import os
import json
import re
from typing import List
from mkcpr.Error import Error
from mkcpr import Util


class Config:

    class EntryNameConstants:
        codeFolder = "code_folder"
        templatePath = "template_path"
        outputFilePath = "output_file_path"
        excluded = "excluded"
        columns = "columns"
        templatePlaceHolder = "template_placeholder"
        sortBefore = "sort_before"
        sortAfter = "sort_after"

    defaultConfigFilename = "mkcpr-config.json"

    mandatoryEntries = [EntryNameConstants.codeFolder, EntryNameConstants.templatePath]

    fileSectionName = "mkcprfile"

    sortedSectionNames: List[str] = [
        "part",
        "chapter",
        "section",
        "subsection",
        "subsubsection",
        "paragraph",
        "subparagraph",
        fileSectionName
    ]

    defaultFontSizeForDepth: List[str] = [
        "\\Huge",
        "\\huge",
        "\\Large",
        "\\large",
        "\\normalsize",
        "\\normalsize",
        "\\normalsize"
    ]

    orderFileName = ".mkcpr_order"

    def __init__(self):
        path = os.getcwd()
        self.properties = {
            Config.EntryNameConstants.codeFolder: os.path.join(path, "CodeFolder"),
            Config.EntryNameConstants.templatePath: os.path.join(path, "Template.tex"),
            Config.EntryNameConstants.outputFilePath: os.path.join(path, "Output.tex"),
            Config.EntryNameConstants.excluded: set(['.vscode', '__pycache__']),
            Config.EntryNameConstants.columns: 2,
            Config.EntryNameConstants.templatePlaceHolder: "CODE HERE",
            Config.EntryNameConstants.sortBefore: set([]),
            Config.EntryNameConstants.sortAfter: set([])
        }

        self.documentClass = "article"
        self.titleStyles = [""] * len(Config.sortedSectionNames)

    def write(self):
        path = os.path.join(os.getcwd(), Config.defaultConfigFilename)
        jsonoutput = {}
        for key, value in self.properties.items():
            if type(value) == set:
                jsonoutput[key] = list(value)
            else:
                jsonoutput[key] = value
        with open(path, 'w+') as f:
            json.dump(jsonoutput, f, indent=4)
        print("Configuration file written in: \"" + str(path) + "\"")

    def read(self):
        path = os.path.join(os.getcwd(), Config.defaultConfigFilename)
        jsonconfig = {}
        try:
            with open(path, "r") as f:
                jsonconfig = json.loads(f.read())
        except json.decoder.JSONDecodeError:
            Error.throwMalformedConfigFile()
        except (FileNotFoundError, IsADirectoryError):
            Error.throwConfigFileNotFound(path)

        for mEntry in self.mandatoryEntries:
            if mEntry not in jsonconfig:
                Error.throwMandatoryEntryNotFoundInConfigFile(mEntry)

        for key, value in self.properties.items():
            if key in jsonconfig:
                jsonconfigValue = jsonconfig[key]
                if type(value) == type(jsonconfigValue):
                    self.properties[key] = jsonconfigValue
                elif type(value) == set and type(jsonconfigValue) == list:
                    self.properties[key] = set(jsonconfigValue)
                else:
                    Error.throwIncorrectTypeForEntryInConfigFile(
                        key, type(value).__name__)

        if not os.path.isdir(self.codeFolderPath()):
            Error.throwCodeFolderNotFound(self.codeFolderPath())

        self.readStyles()

    def readStyles(self):
        texCode = Util.getTexCode(self.templatePath())

        line = re.findall(r"\\documentclass.*}", texCode)[0]
        self.documentClass = line[line.rfind('{') + 1:line.rfind('}')]

        for i, sectionName in enumerate(Config.sortedSectionNames):
            regex = r"\\titleformat{\s*\\" + sectionName + r"\s*}.*[}\]]"
            for style in re.findall(regex, texCode):
                self.titleStyles[i] = style

    def codeFolderPath(self):
        return self.properties[Config.EntryNameConstants.codeFolder]

    def templatePath(self):
        return self.properties[Config.EntryNameConstants.templatePath]

    def columns(self):
        return self.properties[Config.EntryNameConstants.columns]

    def placeholder(self):
        return self.properties[Config.EntryNameConstants.templatePlaceHolder]

    def outputFilePath(self):
        return self.properties[Config.EntryNameConstants.outputFilePath]

    def excluded(self):
        return self.properties[Config.EntryNameConstants.excluded]

    def sortBefore(self):
        return self.properties[Config.EntryNameConstants.sortBefore]

    def sortAfter(self):
        return self.properties[Config.EntryNameConstants.sortAfter]
    
    def rootLevel(self):
        return Util.getRootLevelForDocumentClass(self.documentClass)

    def sectionTypeForDepth(self, depth):
        return Config.sortedSectionNames[min(depth, len(Config.sortedSectionNames) - 2)]

    def getTitleStyleForDepth(self, depth):
        return self.titleStyles[min(depth, len(self.titleStyles) - 2)]

    def getTitleStyle(self, depth, isFile):
        if not isFile or len(self.titleStyles[-1]) == 0:
            return self.titleStyles[min(depth, len(self.titleStyles) - 2)]

        styleCommand = self.titleStyles[-1].replace(Config.fileSectionName, self.sectionTypeForDepth(depth))
        if Util.getFontSizeFromCommand(styleCommand) is not None:
            return styleCommand
        else:
            fontsize = Util.getFontSizeFromCommand(self.getTitleStyleForDepth(depth))
            if not fontsize:
                fontsize = Config.defaultFontSizeForDepth[depth]
            auxList = styleCommand.split("}")
            auxList[1] += fontsize
            return '}'.join(auxList)
