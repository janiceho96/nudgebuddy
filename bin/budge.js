#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';

const DATA_FILE = path.join(os.homedir(), '.nudgebuddy_tasks.json');

// ANSI Color Helpers
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  bgYellow: '\x1b[43m\x1b[30m',
  bgGreen: '\x1b[42m\x1b[30m'
};

function loadTasks() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch {}
  return [
    {
      id: 'task-1',
      title: 'Review Q3 Roadmap draft',
      estimatedMinutes: 25,
      urgency: 'critical',
      energyLevel: 'high',
      tags: ['work'],
      status: 'inbox',
      snoozeCount: 0
    },
    {
      id: 'task-2',
      title: 'Reply to landlord about lease',
      estimatedMinutes: 15,
      urgency: 'high',
      energyLevel: 'low',
      tags: ['admin'],
      status: 'inbox',
      snoozeCount: 1
    }
  ];
}

function saveTasks(tasks) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save tasks:', err.message);
  }
}

function printHeader() {
  console.log(`
${C.yellow}${C.bold} ╔═══════════════════════════════════════════╗
 ║   👾 NudgeBuddy — Terminal Focus CLI      ║
 ╚═══════════════════════════════════════════╝${C.reset}
`);
}

const args = process.argv.slice(2);
const command = args[0] || 'now';

const tasks = loadTasks();

switch (command) {
  case 'now': {
    printHeader();
    const active = tasks.filter(t => t.status !== 'completed');
    if (active.length === 0) {
      console.log(`${C.green}${C.bold}🎉 Inbox Zero! No pending tasks.${C.reset}\n`);
      break;
    }

    // Sort by urgency
    const urgencyWeight = { critical: 100, high: 60, medium: 30, low: 10 };
    active.sort((a, b) => (urgencyWeight[b.urgency] || 30) - (urgencyWeight[a.urgency] || 30));
    const top = active[0];

    console.log(`${C.bgYellow}${C.bold} 🎯 DO THIS NOW ${C.reset}`);
    console.log(`${C.bold}${C.cyan}  Title:${C.reset}  ${C.bold}${top.title}${C.reset}`);
    console.log(`${C.gray}  Time:${C.reset}   ${top.estimatedMinutes} mins`);
    console.log(`${C.gray}  Urgency:${C.reset} ${top.urgency.toUpperCase()}`);
    console.log(`${C.gray}  Tags:${C.reset}   ${top.tags ? top.tags.map(t => '#' + t).join(' ') : 'none'}\n`);
    console.log(`${C.magenta}Budge says:${C.reset} "Stop looking at other tasks. Start your 25m sprint now!"\n`);
    console.log(`${C.gray}Run \`budge start\` to begin the countdown timer.${C.reset}\n`);
    break;
  }

  case 'list': {
    printHeader();
    console.log(`${C.bold}📋 Active Task Inbox (${tasks.filter(t => t.status !== 'completed').length} tasks):${C.reset}\n`);
    tasks.forEach((t, i) => {
      const isDone = t.status === 'completed';
      const check = isDone ? `${C.green}[✓]${C.reset}` : `${C.yellow}[ ]${C.reset}`;
      const title = isDone ? `${C.gray}${t.title}${C.reset}` : `${C.bold}${t.title}${C.reset}`;
      console.log(` ${check} ${i + 1}. ${title} ${C.cyan}(${t.estimatedMinutes}m)${C.reset} ${C.gray}!${t.urgency}${C.reset}`);
    });
    console.log('');
    break;
  }

  case 'add': {
    const rawInput = args.slice(1).join(' ');
    if (!rawInput.trim()) {
      console.log(`${C.red}Please provide a task description. Example: \`budge add "Fix login bug 15m #dev !high"\`${C.reset}`);
      break;
    }

    let text = rawInput;
    let estimatedMinutes = 25;
    let urgency = 'medium';
    let tags = [];

    const timeMatch = text.match(/\b(\d+)\s*(m|min|mins)\b/i);
    if (timeMatch) {
      estimatedMinutes = parseInt(timeMatch[1], 10);
      text = text.replace(timeMatch[0], '').trim();
    }

    const tagMatches = text.match(/#([\w-]+)/g);
    if (tagMatches) {
      tagMatches.forEach(t => {
        tags.push(t.replace('#', ''));
        text = text.replace(t, '').trim();
      });
    }

    if (/!crit(?:ical)?/i.test(text)) {
      urgency = 'critical';
      text = text.replace(/!crit(?:ical)?/i, '').trim();
    } else if (/!high/i.test(text)) {
      urgency = 'high';
      text = text.replace(/!high/i, '').trim();
    }

    const newTask = {
      id: `cli-${Date.now()}`,
      title: text.trim(),
      estimatedMinutes,
      urgency,
      energyLevel: 'medium',
      tags,
      status: 'inbox',
      snoozeCount: 0,
      createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasks(tasks);

    printHeader();
    console.log(`${C.green}${C.bold}✓ Task added!${C.reset}`);
    console.log(`  "${newTask.title}" (${newTask.estimatedMinutes}m, !${newTask.urgency})\n`);
    break;
  }

  case 'start': {
    const mins = parseInt(args[1], 10) || 25;
    let secondsLeft = mins * 60;

    printHeader();
    console.log(`${C.bgGreen}${C.bold} ⏱️  ${mins}-MINUTE FOCUS SPRINT STARTED ${C.reset}`);
    console.log(`${C.magenta}Budge is watching your terminal. Stay locked in!${C.reset}\n`);

    const interval = setInterval(() => {
      secondsLeft--;
      const m = Math.floor(secondsLeft / 60);
      const s = secondsLeft % 60;
      const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

      process.stdout.write(`\r ${C.yellow}${C.bold}⏳ Time Remaining: [ ${timeStr} ]${C.reset}  (Press Ctrl+C to stop)`);

      if (secondsLeft <= 0) {
        clearInterval(interval);
        console.log(`\n\n${C.green}${C.bold}🎉 SPRINT COMPLETE! 25 MINUTES BANKED! High five!${C.reset}\n`);
      }
    }, 1000);
    break;
  }

  case 'done': {
    const targetIdx = parseInt(args[1], 10) - 1;
    if (isNaN(targetIdx) || !tasks[targetIdx]) {
      console.log(`${C.red}Usage: budge done <task-number>${C.reset}`);
      break;
    }

    tasks[targetIdx].status = 'completed';
    tasks[targetIdx].completedAt = new Date().toISOString();
    saveTasks(tasks);

    printHeader();
    console.log(`${C.green}${C.bold}✓ Marked as completed: "${tasks[targetIdx].title}"${C.reset}\n`);
    break;
  }

  case 'help':
  default:
    printHeader();
    console.log(`${C.bold}Available Commands:${C.reset}`);
    console.log(`  ${C.cyan}budge now${C.reset}             Show current #1 recommended task`);
    console.log(`  ${C.cyan}budge list${C.reset}            List all active inbox tasks`);
    console.log(`  ${C.cyan}budge add <task>${C.reset}      Quick capture a task (e.g. \`budge add "Fix bug 15m #dev !high"\`)`);
    console.log(`  ${C.cyan}budge start [mins]${C.reset}    Launch a terminal countdown sprint`);
    console.log(`  ${C.cyan}budge done <index>${C.reset}    Mark task # as completed\n`);
    break;
}
